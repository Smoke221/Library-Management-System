const express = require("express");

const userRouter = express.Router();
const { userRegister, userLogin } = require("../controllers/user");
const { loginRegisterLimiter } = require("../middlewares/rateLimiter");

// Register a new user
userRouter.post("/register", loginRegisterLimiter, userRegister);

// Login an existing user
userRouter.post("/login", loginRegisterLimiter, userLogin);

module.exports = { userRouter };