const jwt = require("jsonwebtoken");

const authMiddleware = (role) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, "your_secret_key"); 
      req.user = decoded;

      if (role && decoded.role !== role) {
        return res.status(403).json({ error: "Forbidden: Insufficient rights" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
