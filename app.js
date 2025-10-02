// app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const thresholdRoutes = require("./routes/thresholdRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const stockRoutes = require("./routes/stockRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api", thresholdRoutes);
app.use("/user", userRoutes);
app.use("/stocks", stockRoutes);
app.use("/admin", authMiddleware("admin"), adminRoutes);

module.exports = app;
