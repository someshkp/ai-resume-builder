const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
    if (isTokenBlacklisted) {
      return res.status(400).json({ error: "Token is blacklisted" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { authMiddleware };
