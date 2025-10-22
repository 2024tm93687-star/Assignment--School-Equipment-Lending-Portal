 const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

// Instead of mandatoryenv, you can directly use environment variables or defaults
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/School_Asset_Mngt';
const SECRET = process.env.SECRET || 'mysecret';

const app = express();

/*mongoose.connect('mongodb://localhost:27017/School_Asset_Mngt', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));
*/

/*const requestSchema = new mongoose.Schema({
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


const requests = mongoose.model('request', requestSchema);
*/
mongoose.connect('mongodb+srv://2024tm93591_db_user:kupl6NAPESY0Z4bK@cluster0.hr3wm0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const borw=require('./Models/userModel');
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
}
insert();


app.get("/api/v1/borrows", async (req, res) => {
  const allBorrows = await requests.find();
  res.json(allBorrows);
});

app.get("/", (req, res) => {
  res.send("Welcome to My API response");
});

app.listen(PORT, () => {
  console.log(`API running at port ${PORT}`);
});
