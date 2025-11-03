const asyncHandler = require('express-async-handler');
const { Author, validateCreateAuthor, validateUpdateAuthor } = require('../models/Author.js');

/**
 * @desc Get all authors
 * @route /api/authors
 * @method GET
 * @access Public
*/

const getAllAuthors = asyncHandler(async (req, res) => {
  const authorList = await Author.find().select("firstName lastName nationality -_id");
  res.status(200).json(authorList);
})

//============================================

/**
 * @desc Get author by id
 * @route /api/authors/:id
 * @method GET
 * @access Public
*/
const getAuthorById = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    res.status(200).json(author);
  } else {
    res.status(404).json({ message: "Author not found" });
  }
})

//============================================

/**
 * @desc Create author
 * @route /api/authors
 * @method POST
 * @access private (only admin)
*/
const createAuthor =  asyncHandler(async (req, res) => {
  const { error } = validateCreateAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationality: req.body.nationality,
    image: req.body.image,
  });

  const result = await author.save();
  res.status(201).json(result);
})

//============================================
/**
 * @desc Update author by id
 * @route /api/authors/:id
 * @method PUT
 * @access private (only admin)
*/
const updateAuthor =  asyncHandler(async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const author = await Author.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
      },
    },
    { new: true }
  );

  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  res.status(200).json(author);
})

//============================================
/**
 * @desc Delete author by id
 * @route /api/authors/:id
 * @method DELETE
 * @access private (only admin)
*/
const deleteAuthor =  asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    await Author.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Author has been deleted" });
  } else {
    res.status(404).json({ message: "Author not found" });
  }
})

module.exports = {
  deleteAuthor,
  updateAuthor,
  createAuthor,
  getAuthorById,
  getAllAuthors
}