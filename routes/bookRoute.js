const express = require("express");
const { authenticate, authorize } = require("../middlewares/authentication");
const { otherLimiter } = require("../middlewares/rateLimiter");
const {
  createBook,
  updateBook,
  deleteBook,
  listBooks,
  borrowBook,
  returnBook,
  searchBooks,
} = require("../controllers/book");

const bookRouter = express.Router();

bookRouter.post("/create", authenticate, authorize("admin"), createBook);
bookRouter.put("/update/:ISBN", authenticate, authorize("admin"), updateBook);
bookRouter.delete("/delete/:ISBN", authenticate, authorize("admin"), deleteBook);
bookRouter.get("/list", listBooks);

bookRouter.post("/borrow/:bookId", authenticate, otherLimiter, borrowBook);
bookRouter.patch("/return/:bookId", authenticate, returnBook);
bookRouter.get("/search", otherLimiter, searchBooks);

module.exports = { bookRouter };
