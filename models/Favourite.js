const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    favouriteProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }]
});

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;
