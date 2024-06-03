const Product = require('../models/Product');
const Favourite = require('../models/Favourite');

const addToFavourites = async (req, res) => {
    const { productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let favourite = await Favourite.findOne();
        if (!favourite) {
            favourite = new Favourite({
                favouriteProducts: [productId]
            });
        } else {
            favourite.favouriteProducts.push(productId);
        }
        await favourite.save();
        res.status(200).json({ message: 'Product added to favourites' });
    } catch (error) {
        console.error('Error adding product to favourites:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const removeFromFavourites = async (req, res) => {
    const { productId } = req.body;

    try {
        const favourite = await Favourite.findOne();
        if (!favourite) {
            return res.status(400).json({ message: 'No favourites found' });
        }
        favourite.favouriteProducts = favourite.favouriteProducts.filter(id => id.toString() !== productId.toString());
        await favourite.save();
        res.status(200).json({ message: 'Product removed from favourites' });
    } catch (error) {
        console.error('Error removing product from favourites:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getFavourites = async (req, res) => {
    try {
        const favourite = await Favourite.findOne();

        if (!favourite) {
            return res.status(404).json({ message: 'No favourites found' });
        }
        res.status(200).json({ favouriteProducts: favourite.favouriteProducts });
    } catch (error) {
        console.error('Error fetching favuorite products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addToFavourites,
    removeFromFavourites,
    getFavourites
};
