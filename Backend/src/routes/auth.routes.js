const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controller/auth.controller");
const authRouter = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/logout", logoutUser);

authRouter.get("/get-me", authMiddleware, getMe);

module.exports = authRouter;
