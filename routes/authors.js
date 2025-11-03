const { Router } = require('express');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken.js');
const { deleteAuthor , updateAuthor , createAuthor , getAuthorById , getAllAuthors } = require('../controllers/authorsController.js');
const router = Router();

//api/authors
router.get("/", getAllAuthors);
router.post("/",verifyTokenAndAdmin,createAuthor);
//api/authors/:id
router.get("/:id", getAuthorById);
router.put("/:id",verifyTokenAndAdmin,updateAuthor);
router.delete("/:id",verifyTokenAndAdmin,deleteAuthor);

module.exports = router;
