const mongoose = require('mongoose');
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
module.exports = mongoose.model('request', requestSchema);