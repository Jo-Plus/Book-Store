const {Book} = require("./models/Book.js");
const {books} = require("./data");
const connectToDb = require("./config/DB.js");
require("dotenv").config();

//connection to db
connectToDb();

//import books
const importBooks = async()=>{
  try {
    await Book.insertMany(books);
    console.log("books imported");
  } catch (error) {
    console.log("error");
    process.exit(1)
  }
}


//remove books
const removeBooks = async()=>{
  try {
    await Book.deleteMany();
    console.log("books removed!");
  } catch (error) {
    console.log("error");
    process.exit(1)
  }
}

if(process.argv[2] === "-import"){
  importBooks();
}else if(process.argv[2] === "-remove"){
  removeBooks();
}

//node seeder -import