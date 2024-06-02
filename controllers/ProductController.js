const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const imagePaths = req.files.map(file => file.path);
        const { sku, quantity, name, description, thumbnailIndex } = req.body;
        const thumbnail = imagePaths[thumbnailIndex];

        const product = new Product({ sku, quantity, name, images: imagePaths, thumbnail, description });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { sku, quantity, name, description, thumbnailIndex } = req.body;
        let imagePaths = [];

        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => file.path);
        }

        const thumbnail = imagePaths[thumbnailIndex];

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { sku, quantity, name, images: imagePaths.length > 0 ? imagePaths : undefined, thumbnail, description },
            { new: true }
        );

        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSearchSuggestion = async (req, res) => {
    const query = req.params.query;
    if (!query) {
      return res.status(400).send({ message: 'Query parameter q is required' });
    }
  
    try {
      const products = await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { sku: { $regex: query, $options: 'i' } }
        ]
      }).limit(10); // Limit the number of suggestions
  
      res.json(products);
    } catch (error) {
      if (error.name === 'MongoError') {  // Check if it's a MongoDB error (optional)
        console.error('Error fetching search suggestions:', error);
        res.status(400).send({ message: 'Invalid search query format' });
      } else {
        console.error('Server error:', error);
        res.status(500).send({ message: 'Server error' });
      }
    }
  };

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getSearchSuggestion
};