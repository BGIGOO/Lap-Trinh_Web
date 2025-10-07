require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mount all routes under /api
app.use("/api", require("./routes"));

/** error handler đặt cuối cùng */
app.use(require("./middleware/error"));

module.exports = app;