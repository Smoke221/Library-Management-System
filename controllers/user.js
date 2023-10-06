const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");
const { logger } = require("../middlewares/logger");

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *               role:
 *                 type: string
 *                 description: User's role (e.g., 'user' or 'admin')
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
async function userRegister(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Hash the user's password before saving it to the database.
    const hash = await bcrypt.hash(password, 10); // Use a stronger salt factor.

    // Check if a user with the given email already exists in the database.
    const isExisting = await userModel.findOne({ email });

    if (isExisting) {
      // User with the same email already exists, return an error.
      logger.error(
        `User registration failed. User with email ${email} already exists.`
      );
      res.status(400).json({ message: "User already exists, please login" });
    } else {
      // Create a new user document with the hashed password.
      const newUser = new userModel({ name, email, password: hash, role });
      await newUser.save();

      // User registration successful.
      logger.info(`New user registered with email ${email}`);
      res.status(201).json({ message: "New user registered" });
    }
  } catch (err) {
    // Handle internal server error.
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       401:
 *         description: Wrong credentials or wrong password
 *       500:
 *         description: Internal server error
 */
async function userLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by their email in the database.
    const user = await userModel.findOne({ email });

    if (user) {
      // Compare the provided password with the hashed password in the database.
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) {
        // Create a JWT token for the user's successful login.
        const token = jwt.sign(
          { userID: user._id, role: user.role },
          "secret",
          {
            expiresIn: "1h", // Token expiration time (e.g., 1 hour)
          }
        );

        // Successful login, return a token.
        logger.info(`User with email ${email} logged in.`);
        res.json({ message: "Logged in", token: token });
      } else {
        // Password does not match.
        logger.error(
          `Login failed for user with email ${email}. Wrong password.`
        );
        res.status(401).json({ message: "Wrong password" });
      }
    } else {
      // User with the provided email does not exist.
      logger.error(`Login failed. User with email ${email} not found.`);
      res.status(401).json({ message: "Wrong credentials" });
    }
  } catch (err) {
    // Handle internal server error.
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

module.exports = { userRegister, userLogin };
