// index.js

const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
const connectDB = require("./config/database");
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');


// Middleware



const corsOptions = {
  origin: 'http://localhost:5173', // Your React app's origin
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth', authRoutes);



connectDB()
     .then(() =>{
        console.log("Database connected successfully!");
       
     app.listen(5000, () => {
     console.log("server running successfully");
});
     })

