const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = Router();

const uploadPath = path.join(__dirname, '../images');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    if (file) {
      cb(
        null,
        Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname
      );
    } else {
      cb(null, false);
    }
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  res.status(200).json({
    message: 'Image uploaded successfully',
    file: req.file.filename,
  });
});

module.exports = router;
