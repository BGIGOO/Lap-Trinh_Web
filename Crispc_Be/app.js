const express = require("express");
const app = express();
const sequelize = require("./config/database");

app.use(express.json());                          // nhận JSON
app.use(express.urlencoded({ extended: true }));  // nhận form (x-www-form-urlencoded)

const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

const helmet = require("helmet");
app.use(helmet());

sequelize.authenticate()
  .then(() => console.log("✅ MySQL connected"))
  .catch(err => console.log("❌ Error: " + err));

module.exports = app;