const { logger } = require("../middlewares/logger");
const { bookModel } = require("../models/bookModel");
const { userModel } = require("../models/userModel");

async function createBook(req, res) {
  try {
    const { ISBN, title, author, publishedYear, quantity } = req.body;

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

async function updateBook(req, res) {
  try {
    const { ISBN } = req.params;
    const { title, author, publishedYear, quantity } = req.body;

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

    // Save the updated book document
    await book.save();

    res.status(200).json({ message: "Book details updated successfully." });
  } catch (error) {
    // Log any errors that occur during the update
    logger.error(`Error while updating book: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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

async function listBooks(req, res) {
  try {
    // Find all books
    const books = await bookModel.find();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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
