const express = require("express");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/userRoute");
const { bookRouter } = require("./routes/bookRoute");
const { recommendRouter } = require("./routes/recommendations");
require("dotenv").config();
const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/book", bookRouter);
app.use("/rec", recommendRouter)

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Server is running at port ${process.env.PORT}`);
});
