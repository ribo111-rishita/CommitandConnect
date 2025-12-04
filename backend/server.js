// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const chatRoutes = require('./routes/chat');
dotenv.config();

const app = express();

// FIXED CORS — ALLOW YOUR FRONTEND PORT
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use('/api/chat', chatRoutes);

// ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const mentorRoutes = require("./routes/mentors");
const matchesRoutes = require("./routes/matches");
const chatRouter = require("./routes/chat");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/chat", chatRouter);

// CONNECT & START SERVER
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo connected");
    app.listen(8000, () => console.log("Server running on port 8000"));
  })
  .catch((err) => console.error(err));
