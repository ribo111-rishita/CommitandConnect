// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const mentorRoutes = require("./routes/mentors");
const matchesRoutes = require("./routes/matches");
const chatRoutes = require("./routes/chat");

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/chat", chatRoutes);


// Connect & Start Server

async function connectDb(){
  try {
     const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URI}/commitconnect`);
     console.log(`MongoDB connected to ${connectionInstance.connection.host}`);
  } catch (error) {
      console.log('MongoDB connection failed, FILE: db/index.js',error);
      process.exit(1);
  }
}

connectDb()
.then(()=>{
    app.listen(process.env.PORT || 8000,'0.0.0.0',()=>{
        console.log('Express App Started Successfully and Running!')
        console.log(`Server Started at http://localhost:${process.env.PORT || 8000}`)
    })
    
})
.catch(err => console.log('DataBase connection failed'+err) )


