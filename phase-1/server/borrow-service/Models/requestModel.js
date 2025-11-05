//const mongoose = require('mongoose');
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  userId: Number,
  equipmentId: Number,
  status: String,
  issueDate: Date,
  dueDate: Date,
  returnDate: Date,
  remarks: String,
  approvedBy: Number,
  createdAt:Date,    
}, { collection: 'request' });
const requestItem = mongoose.model('request', requestSchema);
export default requestItem;