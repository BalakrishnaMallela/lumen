const mongoose = require("mongoose");


const connectDB = async () =>{
    await mongoose.connect(
    "mongodb+srv://nuthalapatinikshep_db_user:sai%40EC067@namaste.cao2rgy.mongodb.net/lumen"
    );
};
module.exports = connectDB;