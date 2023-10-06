const express = require("express");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/userRoute");
const { bookRouter } = require("./routes/bookRoute");
const { recommendRouter } = require("./routes/recommendations");
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./swagger")
require("dotenv").config();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/", (req, res) => {
  res.send(`
        <h1>Welcome to the Library management with Node.js</h1>
  `);
});

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
