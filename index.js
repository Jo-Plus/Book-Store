const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const connectToDb = require('./config/DB.js');
const { notFound, errorHandler } = require('./middlewares/errors.js');

// Initialize app
const app = express();

// ================= Middleware =================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

// CORS (مفتوح لـ Vercel)
app.use(cors({
  origin: "*",
}));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");

// ================= Database =================
connectToDb();

// ================= Routes =================
app.use("/api/books", require('./routes/books.js'));
app.use("/api/authors", require('./routes/authors.js'));
app.use("/api/auth", require('./routes/auth.js'));
app.use("/api/upload", require('./routes/upload.js'));
app.use("/api/users", require("./routes/user.js"));
app.use("/password", require("./routes/password.js"));

// ================= Errors =================
app.use(notFound);
app.use(errorHandler);

// ❌ ممنوع app.listen في Vercel
// ✅ لازم export
module.exports = app;
