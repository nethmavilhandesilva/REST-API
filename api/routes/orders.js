// Importing express and creating a router
const express = require('express');
const router = express.Router();

// Handle request to fetch all orders and send a response with status code and a message
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

// Handle request to create a new order and send a response with status and a message
router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'Orders was created',
        order: order
    });
});

// Handle request to fetch details of a specific order by its ID
router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

// Handle request to delete a specific order by its ID and send a response with status and a message
router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});

// Exporting the router
module.exports = router;
