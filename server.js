const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const thresholdRoutes = require("./routes/thresholdRoutes");
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require("./routes/userRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
app.use(bodyParser.json());

// MongoDB connect
mongoose
  .connect("mongodb+srv://bhaskarabbisetti9:Abm13abm13@cluster0.sgdkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api", authMiddleware("admin"), thresholdRoutes);
app.use("/user", authMiddleware("admin"), userRoutes)
app.use("/admin", authMiddleware("admin"), adminRoutes)


const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
