import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './utils/logger.js';
import Borrow from '../Models/requestModel.js';
import authenticate from './middleware/authentication.js';
import { seedBorrows } from './scripts/seedData.js';

const PORT = process.env.PORT || 3010;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test1', async (req, res) => {
  res.send('Get working');
});

// Create borrow request (authenticated users)
app.post('/api/v1/borrow', authenticate, async (req, res) => {
  try {
    const { userId, borrowerName, equipmentId, equipmentName, issueDate, dueDate, remarks } = req.body;

    // Prevent overlapping bookings for same equipment
    const overlap = await Borrow.findOne({
      equipmentId,
      status: { $in: ['pending', 'approved'] }
    });

    if (overlap) {
      return res.status(400).json({ message: 'Equipment already borrowed or booked by someone else.' });
    }

    const newBorrow = new Borrow({
      userId,
      borrowerName: borrowerName || '',
      equipmentId,
      equipmentName: equipmentName || '',
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'pending',
      remarks: remarks || '',
      createdAt: new Date()
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
    const updated = await Borrow.findByIdAndUpdate(req.params.id, { status, approvedBy: req.user.userId }, { new: true });
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
    res.json(list);
  } catch (err) {
    logger.error('Error fetching borrows', err);
    res.status(500).json({ message: 'Failed to fetch borrows', error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to Borrow Service');
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
