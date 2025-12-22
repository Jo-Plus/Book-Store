const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = Router();

const uploadPath = process.env.NODE_ENV === 'production' 
    ? '/tmp' 
    : path.join(__dirname, '../images');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }
    res.status(200).json({
        message: 'Image uploaded successfully to temporary storage',
        file: req.file.filename,
    });
});

module.exports = router;
