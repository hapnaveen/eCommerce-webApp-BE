const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const { updateProduct, addProduct, getAllProducts, getProductById, deleteProduct, getSearchSuggestion } = require('../controllers/ProductController');
const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'productImages/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/search/:query', getSearchSuggestion);
router.post('/', upload.array('images', 5), addProduct);
router.put('/:id', upload.array('images', 5), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;