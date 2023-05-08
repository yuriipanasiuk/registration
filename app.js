const express = require("express");
const cors = require("cors");
const logger = require("morgan");
require("dotenv").config();
const usersRouter = require("./routes/api/users");

const app = express();
const formatLogger = app.get("env") === "development" ? "dev" : "short";

app.use(express.json());
app.use(cors());
app.use(logger(formatLogger));

app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).json({ message: err.message });
});

module.exports = app;
