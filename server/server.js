const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const UserRoute = require("./routes/UserRoute");

const mongoose = require("mongoose");
const recordRoute = require("./routes/RecordingRoute")

const app = express();
app.use(cors());
app.use(bodyparser.json());

mongoose
  .connect("mongodb://localhost:27017/mern-rtc", { useNewUrlParser: true })
  .then(() => {
    console.log("Mongodb is Connected...!!");
  });

app.use("/", UserRoute);
app.use("/", recordRoute)

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
