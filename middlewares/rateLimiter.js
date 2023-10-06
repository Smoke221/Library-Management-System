const rateLimit = require("express-rate-limit");

// Rate limiting for user login and registration
const loginRegisterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 requests per IP per hour
  message:
    "Too many login/register attempts from this IP. Please wait for an hour before trying again.",
});

const otherLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

module.exports = {
  loginRegisterLimiter,
  otherLimiter
};
