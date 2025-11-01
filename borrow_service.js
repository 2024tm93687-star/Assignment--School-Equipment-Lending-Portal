//const express = require('express');
import express from 'express';
import mongoose from 'mongoose';
import Request from './Models/requestModel.js';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://2024tm93591_db_user:kupl6NAPESY0Z4bK@cluster0.hr3wm0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
//const borw=require('./Models/requestModel.js');
import borw from './Models/requestModel.js';
/*
async function insert(){
    await borw.create({
  userId: 1001,
  equipmentId: 1234,
  status: 'Approved',
  issueDate: '2025-10-20',
  dueDate: '2025-10-25',
  returnDate:'' ,
  remarks: 'Tennis Net for sports event',
  approvedBy: 1001,
  createdAt:'', 
    });
} */
//insert();

app.post('/api/v1/requests', async (req, res) => {
    try {
      const newRequest=new Request({
      userId: req.body.userId,
      equipmentId: req.body.equipmentId,
      status: req.body.status || 'pending',
      issueDate: req.body.issueDate,
      returnDate:'',
      dueDate: req.body.dueDate,
      remarks: req.body.remarks
      
    });
const savedRequest = await newRequest.save();
 res.status(201).json({
      message: "Equipment Borrow Request Created Successfully",
      data: savedRequest
    });
}catch (err)
{ console.error(err);
    res.status(500).json({
      message: "Failed to create borrow request",
      error:err.message
    });
}
});

app.get("/api/v1/borrows", async (req, res) => {
  const allBorrows = await Request.find();
  res.json(allBorrows);
});


// Connect to MongoDB Atlas
const myDB_URL='mongodb+srv://2024tm93591_db_user:kupl6NAPESY0Z4bK@cluster0.hr3wm0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//mongoose.connect('mongodb+srv://2024tm93591_db_user:kupl6NAPESY0Z4bK@cluster0.hr3wm0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
//const MONGODB_URL='mongodb+srv://pradipeeda_db_user:v1WqgL05G9Tn9Cgx@cluster0.84rzz40.mongodb.net/equipment_management?retryWrites=true&w=majority';
//mongoose.connect('mongodb+srv://2024tm93591_db_user:kupl6NAPESY0Z4bK@cluster0.hr3wm0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
mongoose.connect(myDB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Borrow Service connected to DB"))
  .catch(err => console.error("DB connection error:", err));

// POST: Create Borrow Request
app.post('/api/v1/borrow', async (req, res) => {
  try {
    const { userId, equipmentId, issueDate, dueDate } = req.body;

    // Prevent overlapping bookings for same equipment
    const overlap = await borw.findOne({
      equipmentId,
      status: { $in: ['pending', 'approved'] }
    });

    if (overlap) {
      return res.status(400).json({ message: 'Equipment already borrowed or booked by someone else.' });
    }

    const newBorrow = new borw({
      userId,
      equipmentId,
      issueDate,
      dueDate,
      status: 'pending'
    });

    const savedBorrow = await newBorrow.save();
    res.status(201).json({ message: 'Borrow request created', data: savedBorrow });

  } catch (err) {
    res.status(500).json({ message: 'Error creating borrow request', error: err.message });
  }
});

// PUT: Approve or Reject by Admin/Staff
app.put('/api/v1/borrow/:id/approve', async (req, res) => {
  try {
     console.log("Received Body:", req.body);
    const { status } = req.body; // 'approved' or 'rejected'
    const updated = await borw.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: ` Request ${status}`, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: ' Error updating status', error: err.message });
  }
});

// GET: List all Borrow Requests
app.get('/api/borrow', async (req, res) => {
  const list = await borw.find();
  res.json(list);
});
/*
app.get('/', (req, res) => res.send("Borrow Service Running"));
app.listen(3001, () => console.log("Borrow Service running on port 3001"));
*/

app.get("/", (req, res) => {
  res.send("Welcome to School Equipment Lending Portal");
});

app.listen(PORT, () => {
  console.log(`API running at port ${PORT}`);
});
export default app;