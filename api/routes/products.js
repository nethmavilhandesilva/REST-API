const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Importing the Product model
const Product = require('../models/product');

// Middleware to parse JSON (should already be applied in your main app file)
router.use(express.json());

// Handling GET request for all products
router.get('/', (req, res) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log("From Database:", docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.error("Error fetching products:", err);
            res.status(500).json({ error: err.message });
        });
});

// Handling POST request to create a product
router.post('/', (req, res) => {
    const { name, price } = req.body;

    // Validate input
    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message: 'Invalid input: Name is required and must be a string.' });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ message: 'Invalid input: Price must be a valid positive number.' });
    }

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: name.trim(),
        price: parsedPrice
    });

    product.save()
        .then(result => {
            console.log('Product created:', result);
            res.status(201).json({
                message: 'Product created successfully',
                createdProduct: result
            });
        })
        .catch(err => {
            console.error('Error saving product:', err);
            res.status(500).json({ error: err.message });
        });
});

// Handling GET request for a specific product by ID
router.get('/:productId', (req, res) => {
    const id = req.params.productId;

    Product.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                console.log("From Database:", doc);
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'No valid entry found for the provided ID' });
            }
        })
        .catch(err => {
            console.error("Error fetching product:", err);
            res.status(500).json({ error: err.message });
        });
});

// Handling DELETE request to delete a specific product by ID
router.delete('/:productId', (req, res) => {
    const id = req.params.productId;

    Product.deleteOne({ _id: id })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({
                message: 'Product deleted successfully',
                result: result
            });
        })
        .catch(err => {
            console.error("Error deleting product:", err);
            res.status(500).json({ error: err.message });
        });
});

// Handling PATCH request to update specific fields of a product by ID
router.patch('/:productId', (req, res) => {
    const id = req.params.productId;
    const updateOps = {};

    // Validate and construct updateOps
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ message: "Invalid request body format. Expected an array of update operations." });
    }

    for (const ops of req.body) {
        if (ops.propName && ops.value !== undefined) {
            updateOps[ops.propName] = ops.value;
        } else {
            return res.status(400).json({ message: "Each update operation must have 'propName' and 'value'." });
        }
    }

    // Check if the product exists before updating
    Product.findById(id)
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found.' });
            }

            // Proceed with update if product exists
            Product.updateOne({ _id: id }, { $set: updateOps })
                .exec()
                .then(result => {
                    if (result.nModified > 0) {
                        res.status(200).json({
                            message: 'Product updated successfully',
                            result: result
                        });
                    } else {
                        res.status(200).json({
                            message: 'No fields were updated as the new values match the existing values.'
                        });
                    }
                })
                .catch(err => {
                    console.error("Error updating product:", err);
                    res.status(500).json({ error: err.message });
                });
        })
        .catch(err => {
            console.error("Error finding product:", err);
            res.status(500).json({ error: err.message });
        });
});

module.exports = router;
