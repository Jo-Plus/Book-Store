const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const connectToDb = require('./config/DB.js');
const { notFound, errorHandler } = require('./middlewares/errors.js');

const port = process.env.PORT || 8000;

// Initialize app
const app = express();

//static folder
app.use(express.static(path.join(__dirname , "images")));

//connection to database
connectToDb();

// Middleware to parse JSON before routes
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin:'http://localhost:3000',
}));

//ejs MVC
app.set("view engine" , "ejs")
app.use(express.urlencoded({extended: false}));

// Routes
app.use("/api/books", require('./routes/books.js'));
app.use("/api/authors", require('./routes/authors.js'));
app.use("/api/auth", require('./routes/auth.js'));
app.use("/api/upload", require('./routes/upload.js'));
app.use("/api/users", require("./routes/user.js"));
app.use("/password", require("./routes/password.js"));

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));
