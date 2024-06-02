const express = require('express');
const { addToFavourites, removeFromFavourites, getFavourites } = require('../controllers/FavouriteController');
const router = express.Router();

router.post('/add', addToFavourites);
router.post('/remove', removeFromFavourites);
router.get('/', getFavourites)

module.exports = router;
