const { Router } = require('express');
const { updateUser , getAllUsers , getUserById , deleteUser } = require('../controllers/userController.js');
const router = Router();
const { verifyTokenAndAutherization , verifyTokenAndAdmin } = require('../middlewares/verifyToken.js');

// api/users
router.get("/",verifyTokenAndAdmin,getAllUsers)
// api/users/:id
router.put("/:id",verifyTokenAndAutherization,updateUser)
router.get("/:id",verifyTokenAndAutherization,getUserById)
router.delete("/:id",verifyTokenAndAutherization,deleteUser)

module.exports = router;