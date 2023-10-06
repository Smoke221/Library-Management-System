const { logger } = require("../middlewares/logger");
const { bookModel } = require("../models/bookModel");
const { userModel } = require("../models/userModel");

/**
 * @swagger
 * /book/create:
 *   post:
 *     summary: Create a new book
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []  # Use the authentication token
 *     responses:
 *       201:
 *         description: Book created successfully
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *       403:
 *         description: Forbidden, the user does not have permission to create books
 *       500:
 *         description: Internal server error
 */
async function createBook(req, res) {
  try {
    const { ISBN, title, author, publishedYear, quantity, genre } = req.body;

    // Check if the ISBN already exists in the database
    const existingBook = await bookModel.findOne({ ISBN });

    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists." });
    }

    // Create a new book document
    const newBook = new bookModel({
      ISBN,
      title,
      author,
      publishedYear,
      quantity,
      genre,
    });

    // Save the book document to the database
    await newBook.save();

    res.status(201).json({ message: "Book added successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

/**
 * @swagger
 * /book/update/{ISBN}:
  *   put:
 *     summary: Update book details by ISBN
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: ISBN
 *         required: true
 *         schema:
 *           type: string
 *         description: The ISBN of the book to update
 *     security:
 *       - bearerAuth: []  # Use the authentication token
 *     responses:
 *       200:
 *         description: Book details updated successfully
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *       403:
 *         description: Forbidden, the user does not have permission to update books
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
async function updateBook(req, res) {
  try {
    const { ISBN } = req.params;
    const { title, author, publishedYear, quantity, genre } = req.body;

    // Find the book by ISBN
    const book = await bookModel.findOne({ ISBN });

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Update the book details
    book.title = title || book.title;
    book.author = author || book.author;
    book.publishedYear = publishedYear || book.publishedYear;
    book.quantity = quantity || book.quantity;
    book.genre = genre || book.genre;

    // Save the updated book document
    await book.save();

    res.status(200).json({ message: "Book details updated successfully." });
  } catch (error) {
    // Log any errors that occur during the update
    logger.error(`Error while updating book: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * @swagger
 * /book/delete/{ISBN}:
 *   delete:
 *     summary: Delete a book by ISBN
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: ISBN
 *         required: true
 *         schema:
 *           type: string
 *         description: The ISBN of the book to delete
 *     security:
 *       - bearerAuth: []  # Use the authentication token
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *       403:
 *         description: Forbidden, the user does not have permission to delete books
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
async function deleteBook(req, res) {
  try {
    const { ISBN } = req.params;

    // Find and delete the book by ISBN
    const deletedBook = await bookModel.findOneAndDelete({ ISBN });

    if (!deletedBook) {
      // Log that the book was not found for deletion
      logger.error(`Book with ISBN ${ISBN} not found for deletion.`);
      return res.status(404).json({ message: "Book not found." });
    }

    // Log the book deletion activity
    logger.info(`Book with ISBN ${ISBN} deleted.`);

    res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    logger.error(`Error while deleting book: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
/**
 * @swagger
 * /book/list:
 *   get:
 *     summary: Get a list of books with pagination
 *     tags:
 *       - Books
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number (default is 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page (default is 10)
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/book'  # Reference to the Book schema
 *       500:
 *         description: Internal server error
 */
async function listBooks(req, res) {
  try {
    // Parse query parameters for pagination
    const page = parseInt(req.query.page) || 1; // Default to page 1 if page is not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

    // Calculate the number of documents to skip
    const skip = (page - 1) * pageSize;

    // Query the database to get paginated books
    const books = await bookModel
      .find()
      .skip(skip)
      .limit(pageSize);

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * @swagger
 * /book/borrow/{bookId}:
 *   post:
 *     summary: Borrow a book
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to borrow
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: The ID of the user borrowing the book
 *             example:
 *               userID: "user123"  # Replace with an actual user ID
 *     security:
 *       - bearerAuth: []  # Use the authentication token 
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       400:
 *         description: Bad request, user has reached borrowing limit, book not available, or book already borrowed
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *       403:
 *         description: Forbidden, the user does not have permission to borrow books
 *       404:
 *         description: Book or user not found
 *       500:
 *         description: Internal server error
 */
async function borrowBook(req, res) {
  try {
    const userId = req.body.userID; // Get the user ID from the auth middleware
    const { bookId } = req.params;

    // Check if the user and book exist
    const user = await userModel.findById(userId);
    const book = await bookModel.findById(bookId);

    if (!user || !book) {
      return res.status(404).json({ message: "User or book not found." });
    }

    // Check if the user has reached their borrowing limit
    if (user.borrowedBooks.length >= 3) {
      return res
        .status(400)
        .json({ message: "You have reached your maximum borrowing limit." });
    }

    // Check if the book is available (quantity > 0)
    if (book.quantity <= 0) {
      return res
        .status(400)
        .json({ message: "This book is currently not available." });
    }

    // Check if the user has already borrowed this book
    if (user.borrowedBooks.includes(bookId)) {
      return res
        .status(400)
        .json({ message: "You have already borrowed this book." });
    }

    // Reduce the book's quantity by 1
    book.quantity -= 1;

    // Update the user's borrowedBooks array
    user.borrowedBooks.push(bookId);

    // Add the user's borrowing details to the book's borrowDetails array
    book.borrowDetails.push({
      user: userId,
      returnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Assuming a 30-day borrowing period
    });

    await book.save();
    await user.save();

    // Log the borrowing activity
    logger.info(`User ${userId} borrowed book ${bookId}`);

    res.status(200).json({ message: "Book borrowed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * @swagger
 * /book/return/{bookId}:
 *   patch:
 *     summary: Return a borrowed book
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to return
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: The ID of the user returning the book
 *             example:
 *               userID: "user123"  # Replace with an actual user ID
 *     security:
 *       - bearerAuth: []  # Use the authentication token
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Bad request, user has not borrowed the book
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *       403:
 *         description: Forbidden, the user does not have permission to return books
 *       404:
 *         description: Book or user not found
 *       500:
 *         description: Internal server error
 */
async function returnBook(req, res) {
  try {
    const userId = req.body.userID; // Get the user ID from the auth middleware
    const { bookId } = req.params;

    // Check if the user and book exist
    const user = await userModel.findById(userId);
    const book = await bookModel.findById(bookId);

    if (!user || !book) {
      return res.status(404).json({ message: "User or book not found." });
    }

    // Check if the user has borrowed the book
    if (!user.borrowedBooks.includes(bookId)) {
      return res
        .status(400)
        .json({ message: "You have not borrowed this book." });
    }

    // Increase the book's quantity by 1
    book.quantity += 1;

    // Update the user's borrowedBooks array
    user.borrowedBooks = user.borrowedBooks.filter(
      (b) => b.toString() !== bookId
    );

    // Update the book's borrowDetails array
    book.borrowDetails = book.borrowDetails.filter(
      (detail) => !detail.user.equals(userId)
    );

    await book.save();
    await user.save();

    res.status(200).json({ message: "Book returned successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * @swagger
 * /book/search:
 *   get:
 *     summary: Search for books by title, author, or ISBN
 *     tags:
 *       - Books
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query for books (title, author, or ISBN)
 *     responses:
 *       200:
 *         description: A list of books matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'  # Reference to the Book schema
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *       403:
 *         description: Forbidden, the user does not have permission to search for books
 *       500:
 *         description: Internal server error
 */
async function searchBooks(req, res) {
  try {
    const { query } = req.query;

    // Use a regular expression to perform a case-insensitive search
    const regex = new RegExp(query, "i");

    // Search for books by title, author, or ISBN
    const results = await bookModel.find({
      $or: [{ title: regex }, { author: regex }, { ISBN: regex }],
    });

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  listBooks,
  borrowBook,
  returnBook,
  searchBooks,
};
