const rateLimit = require("express-rate-limit");

// Rate limiting for user login and registration
const loginRegisterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 requests per IP per hour
  message:
    "Too many login/register attempts from this IP. Please wait for an hour before trying again.",
});

// Rate limiting for product listing
const productListingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 25, // Max 25 requests per IP per hour
  message:
    "Rate limit exceeded for product listing. You have made too many requests in a short time. Please wait and try again later.",
});

// Rate limiting for cart operations
const cartOperationsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Max 15 requests per IP per hour
  message:
    "Rate limit exceeded for cart operations. You have reached the maximum allowed requests for cart actions. Please try again later.",
});

// Rate limiting for order placement
const orderPlacementLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 orders per IP per hour
  message:
    "Rate limit exceeded for order placement. You can place a maximum of 5 orders per hour. Please try again later if needed.",
});

module.exports = {
  loginRegisterLimiter,
  productListingLimiter,
  cartOperationsLimiter,
  orderPlacementLimiter,
};
