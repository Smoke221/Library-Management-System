const express = require("express");
const { authenticate } = require("../middlewares/authentication");
const {
  createBook,
  updateBook,
  deleteBook,
  listBooks,
  borrowBook,
} = require("../controllers/admin");

const bookRouter = express.Router();

bookRouter.post("/create", createBook);
bookRouter.put("/update/:ISBN", updateBook);
bookRouter.delete("/delete/:ISBN", deleteBook);
bookRouter.get("/books", listBooks);

bookRouter.post("/borrow/:bookId", authenticate, borrowBook);
module.exports = { bookRouter };
