const express = require('express');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const connectToDb = require('./config/DB.js');
const { notFound, errorHandler } = require('./middlewares/errors.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use(cors({
  origin: "*",
}));

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(async (req, res, next) => {
  await connectToDb();
  next();
});


app.get('/', (req, res) => {
  res.status(200).send('<h1>Welcome to Book Store API ^_^</h1><p>The server is running successfully on Vercel.</p>');
});

app.use("/api/books", require('./routes/books.js'));
app.use("/api/authors", require('./routes/authors.js'));
app.use("/api/auth", require('./routes/auth.js'));
app.use("/api/upload", require('./routes/upload.js'));
app.use("/api/users", require("./routes/user.js"));
app.use("/password", require("./routes/password.js"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
