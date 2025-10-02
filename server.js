// server.js
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const app = require("./app");

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// Middleware: Authenticate socket
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token || !token.startsWith("Bearer ")) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], "your_secret_key");
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("⚡ New client connected");
  const email = socket.user.email;  // from JWT payload
  socket.join(email);
  socket.on("subscribe", (symbol) => socket.join(symbol));
  socket.on("unsubscribe", (symbol) => socket.leave(symbol));
  socket.on("disconnect", () => console.log("❌ Client disconnected"));
});

const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Server + WebSocket running on ${PORT}`));
// Export io for consumer.js
module.exports = io;
