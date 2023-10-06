const jwt = require("jsonwebtoken");

// Middleware to authenticate incoming requests using JWT
const authenticate = (req, res, next) => {
  // Check if the request contains an authorization header with a token
  const token = req.headers.authorization;

  if (token) {
    // Verify the token with your secret key
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        // Token verification failed (e.g., expired or tampered)
        res.status(401).json({ msg: "Invalid token, please login again" });
      } else {
        // Token is valid, extract the userID and role from the decoded payload
        const { userID, role } = decoded;
  
        // Now you have access to both userID and role
        req.body.userID = userID;
        req.body.role = role;
  
        // Proceed to the next middleware/route
        next();
      }
    });
  } else {
    // No token provided in the request header
    res.status(401).json({ msg: "Authorization token required" });
  }
};

// Middleware for authorization based on user role
const authorize = (requiredRole) => (req, res, next) => {
  const role = req.body.role

  // Check if the user's role matches the required role
  if (role === requiredRole) {
    // User is authorized, proceed to the next middleware/route
    next();
  } else {
    // User is not authorized to access this route
    res.status(403).json({ msg: "Access forbidden" });
  }
};

module.exports = { authenticate, authorize };
