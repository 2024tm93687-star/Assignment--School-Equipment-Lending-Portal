import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fetch from 'node-fetch';
import logger from './utils/logger.js';
import Borrow from '../Models/requestModel.js';
import authenticate from './middleware/authentication.js';
import { seedBorrows } from './scripts/seedData.js';

const PORT = process.env.PORT || 3010;
const EQUIPMENT_SERVICE_URL = process.env.EQUIPMENT_SERVICE_URL || 'http://equipment-service:3000/api/equipment';
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test1', async (req, res) => {
  res.send('Get working');
});

// Create borrow request (authenticated users)
app.post('/api/v1/borrow', authenticate, async (req, res) => {
  try {
    const { userId: bodyUserId, borrowerName: bodyBorrowerName, equipmentId, equipmentName, issueDate, dueDate, remarks } = req.body;

    // Prefer authenticated user info when available
    const userId = req.user?.userId ?? bodyUserId;
    const borrowerName = bodyBorrowerName || req.user?.username || req.user?.fullName || '';

    // Prevent overlapping bookings for same equipment
    const overlap = await Borrow.findOne({
      equipmentId,
      status: { $in: ['pending', 'approved'] }
    });

    if (overlap) {
      return res.status(400).json({ message: 'Equipment already borrowed or booked by someone else.' });
    }

    // Prevent same user requesting the same equipment if they already have one pending/approved
    if (userId) {
      const existingForUser = await Borrow.findOne({
        equipmentId,
        userId,
        status: { $in: ['pending', 'approved'] }
      });
      if (existingForUser) {
        return res.status(400).json({ message: 'Already one equipment is with them.' });
      }
    }

    const newBorrow = new Borrow({
      userId,
      borrowerName,
      equipmentId,
      equipmentName: equipmentName || '',
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'pending',
      remarks: remarks || '',
      createdAt: new Date(),
    });

    const savedBorrow = await newBorrow.save();
    res.status(201).json({ message: 'Borrow request created', data: savedBorrow });
  } catch (err) {
    logger.error('Error creating borrow request', err);
    res.status(500).json({ message: 'Error creating borrow request', error: err.message });
  }
});

// Approve or reject (admin/staff)
app.put('/api/v1/borrow/:id/approve', authenticate, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    // Load borrow so we can set issueDate/dueDate when approving
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) return res.status(404).json({ message: 'Borrow request not found' });

    if ((status || '').toLowerCase() === 'approved') {
      // set issueDate to now if not set
      if (!borrow.issueDate) borrow.issueDate = new Date();
      // set dueDate to 7 days from issueDate if not set
      if (!borrow.dueDate) {
        const issue = borrow.issueDate || new Date();
        const sevenDays = new Date(issue.getTime() + 7 * 24 * 60 * 60 * 1000);
        borrow.dueDate = sevenDays;
      }
    }

    borrow.status = status;
    borrow.approvedBy = req.user.userId;
    const updated = await borrow.save();

  // If approved, decrement equipment availability via equipment-service
    if (updated && (status || '').toLowerCase() === 'approved') {
      try {
        const authHeader = req.headers.authorization || '';
        const maybeId = updated.equipmentId;
        const isObjectId = typeof maybeId === 'string' && /^[0-9a-fA-F]{24}$/.test(maybeId);

        const decAvailableById = async (eqId) => {
          const url = `${EQUIPMENT_SERVICE_URL}/${eqId}`;
          // Before decrementing, fetch equipment by name to get current available if needed
          await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify({ $inc: { available: -1 } }),
          });
        };

        if (isObjectId) {
          await decAvailableById(maybeId);
        } else if (updated.equipmentName) {
          const query = `?name=${encodeURIComponent(updated.equipmentName)}`;
          const listRes = await fetch(`${EQUIPMENT_SERVICE_URL}${query}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(authHeader ? { Authorization: authHeader } : {}),
            },
          });
          if (listRes.ok) {
            const body = await listRes.json();
            const items = body?.items || [];
            if (items.length > 0) {
              const eqId = items[0]._id;
              await decAvailableById(eqId);
            }
          }
        }
      } catch (e) {
        logger.error('Failed to decrement equipment availability on approve', e);
      }
    }

    res.json({ message: `Request ${status}`, data: updated });
  } catch (err) {
    logger.error('Error updating borrow status', err);
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
});

// List borrows. Students see only their records; staff/admin see all
app.get('/api/v1/borrows', authenticate, async (req, res) => {
  try {
    const role = (req.user.role || '').toLowerCase();
    let list;
    if (role === 'student') {
      list = await Borrow.find({ userId: req.user.userId });
    } else {
      list = await Borrow.find();
    }
    // Mark overdue borrows: approved and past dueDate and not returned
    try {
      const now = new Date();
      // update server-side so clients receive correct status
      await Borrow.updateMany({ status: { $in: ['approved'] }, dueDate: { $lt: now }, returnDate: null }, { $set: { status: 'overdue' } });
      // refetch list to include any status changes
      list = role === 'student' ? await Borrow.find({ userId: req.user.userId }) : await Borrow.find();
    } catch (e) {
      logger.error('Error updating overdue statuses', e);
    }

    res.json(list);
  } catch (err) {
    logger.error('Error fetching borrows', err);
    res.status(500).json({ message: 'Failed to fetch borrows', error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to Borrow Service');
});

// Mark a borrow as returned and increment equipment availability
app.put('/api/v1/borrow/:id/return', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const borrow = await Borrow.findById(id);
    if (!borrow) return res.status(404).json({ message: 'Borrow request not found' });

    if ((borrow.status || '').toLowerCase() === 'returned') {
      return res.status(400).json({ message: 'Already returned' });
    }

    // Update borrow status locally
    borrow.status = 'returned';
    borrow.returnDate = new Date();
    await borrow.save();

    // Attempt to notify equipment-service to increase available count
    try {
      const authHeader = req.headers.authorization || '';

      // Helper to call equipment PUT by id with $inc operator
      const incAvailableById = async (eqId) => {
        const url = `${EQUIPMENT_SERVICE_URL}/${eqId}`;
        await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
          body: JSON.stringify({ $inc: { available: 1 } }),
        });
      };

      // If equipmentId is a possible ObjectId string, try direct update
      const maybeId = borrow.equipmentId;
      const isObjectId = typeof maybeId === 'string' && /^[0-9a-fA-F]{24}$/.test(maybeId);
      if (isObjectId) {
        await incAvailableById(maybeId);
      } else if (borrow.equipmentName) {
        // Try to find equipment by name then update by its _id
        const query = `?name=${encodeURIComponent(borrow.equipmentName)}`;
        const listRes = await fetch(`${EQUIPMENT_SERVICE_URL}${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
        });
        if (listRes.ok) {
          const body = await listRes.json();
          const items = body?.items || [];
          if (items.length > 0) {
            const eqId = items[0]._id;
            await incAvailableById(eqId);
          }
        }
      }
    } catch (e) {
      // Log and continue; borrow is marked returned regardless of equipment-service result
      logger.error('Failed to update equipment availability', e);
    }

    res.json({ message: 'Marked returned', data: borrow });
  } catch (err) {
    logger.error('Error marking return', err);
    res.status(500).json({ message: 'Error marking returned', error: err.message });
  }
});

// Connect to MongoDB and seed
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://mongodb:27017/borrowdb';

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Borrow Service connected to DB');
  try {
    await seedBorrows();
  } catch (e) {
    console.error('Seeding failed', e);
  }
}).catch(err => console.error('DB connection error:', err));

app.listen(PORT, () => {
  console.log(`Borrow API running at port ${PORT}`);
});

export default app;
