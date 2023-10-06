const express = require("express");
const { authenticate } = require("../middlewares/authentication");
const { otherLimiter } = require("../middlewares/rateLimiter");
const {
  createBook,
  updateBook,
  deleteBook,
  listBooks,
  borrowBook,
  returnBook,
  searchBooks,
} = require("../controllers/admin");

const bookRouter = express.Router();

bookRouter.post("/create", createBook);
bookRouter.put("/update/:ISBN", updateBook);
bookRouter.delete("/delete/:ISBN", deleteBook);
bookRouter.get("/books", listBooks);

bookRouter.post("/borrow/:bookId", authenticate, otherLimiter, borrowBook);
bookRouter.patch("/return/:bookId", authenticate, returnBook);
bookRouter.get("/search", otherLimiter, searchBooks);

module.exports = { bookRouter };
