//const mongoose = require('mongoose');
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  userId: Number,
  borrowerName: String,
  equipmentId: mongoose.Schema.Types.Mixed,
  equipmentName: String,
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