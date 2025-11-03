const { Router } = require('express');
const { getAllBooks , getBookById , createBook , updateBook , deleteBook} = require('../controllers/bookController.js');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken.js');
const router = Router();

// api/books
router.get("/", getAllBooks );
router.post("/",verifyTokenAndAdmin, createBook);
// api/books/:id
router.get("/:id", getBookById);
router.put("/:id",verifyTokenAndAdmin, updateBook);
router.delete("/:id",verifyTokenAndAdmin, deleteBook);

//=================================================================

module.exports = router;
