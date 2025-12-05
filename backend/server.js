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
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo connected");
    app.listen(8000, () => console.log("Server running on port 8000"));
  })
  .catch((err) => console.error(err));
