const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const thresholdRoutes = require("./routes/thresholdRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(bodyParser.json());

// MongoDB connect
mongoose
  .connect(
    "mongodb+srv://bhaskarabbisetti9:Abm13abm13@cluster0.sgdkk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api", authMiddleware("user"), thresholdRoutes);
app.use("/user", authMiddleware("user"), userRoutes);
app.use("/admin", authMiddleware("admin"), adminRoutes);

// ✅ Create HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
  },
});

// ✅ Middleware: Authenticate socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token; // frontend sends { auth: { token } }
  if (!token || !token.startsWith("Bearer ")) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], "your_secret_key");
    socket.user = decoded; // store user info in socket
    return next();
  } catch (err) {
    return next(new Error("Invalid token"));
  }
});

// Handle client connections
io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.user.email}`);

  // Auto-join user into a room using their email
  socket.join(socket.user.email);

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.user.email}`);
  });
});


const PORT = 4000;
server.listen(PORT, () => console.log(`Server + WebSocket on port ${PORT}`));

// ✅ Export io so consumer can emit events
module.exports = io;
