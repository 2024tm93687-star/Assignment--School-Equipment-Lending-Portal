const express=require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
//const logger = require('./util/logger');

// Load .env Enviroment Variables to process.env
//const PORT = process.env.PORT || 3000;
require('mandatoryenv').load([
    'DB_URL',
    3000,
    'SECRET'
]);

const app=express();
mongoose.connect('mongodb://localhost:27017/School_Asset_Mngt',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    );
  const borrowSchema = new mongoose.Schema({
  userId:Int32Array, 
  equipmentId:Int32Array,
  borrow_status:Int32Array, 
  issueDate:Date, 
  dueDate:Date, 
  returnDate:Date,
        });
const borrow=mongoose.model("borrow",borrowSchema);
/*const borrow=[
    {userId:1, equipmentId:101, borrow_status:1, issueDate:'18-10-2025', dueDate:'20-10-2025', returnDate:''},
{ userId:2, equipmentId:102, borrow_status:1, issueDate:'18-10-2025', dueDate:'20-10-2025', returnDate:''},
];*/
app.get("/api/v1/borrow", async(req,res)=>{
    const allborrows= await borrow.find();
    res.json(allborrows);
});


app.get("/",(req,res)=>{
    res.send("Welcome to My API response");
});
app.listen(3000,()=>{
    console.log("API running at port 3000");
});
