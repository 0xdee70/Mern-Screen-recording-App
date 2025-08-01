const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");

const UserRoute = require("./routes/UserRoute");
const recordRoute = require("./routes/RecordingRoute");
const videoEditRoute = require("./routes/VideoEditRoute");

const mongoose = require("mongoose");

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(bodyparser.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect("mongodb://localhost:27017/mern-rtc", { useNewUrlParser: true })
  .then(() => {
    console.log("Mongodb is Connected...!!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use("/", UserRoute);
app.use("/", recordRoute);
app.use("/", videoEditRoute);

app.listen(5000, () => {
  console.log("server listening on port 5000");
});