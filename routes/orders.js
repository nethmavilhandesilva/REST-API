//Importing express and creating a router
const express = require('express');
const router = express.Router();
//Handle requess to fetch all orders and sends a response with status code and a message
router.get('/',(req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});
//Handles a request to create a new order and sends a response status and a message
router.post('/',(req, res, next) => {
    res.status(201).json({
        message: 'Orders was created'
    });
});
//Handles requests to fetch details of a specific order by its ID based on logic (The req.params.orderId retrieves the value of the orderId from the URL.)
//and gives response in status and a message
router.get('/:orderId',(req, res, next) => {
    res.status(200).json({
        message: 'Orders details',
        orderId: req.params.orderId
    });
});
//Handles request to delete specific order by its ID and gives response in status and a messagecc
router.delete('/:orderId',(req, res, next) => {
    res.status(200).json({
        message: 'Orders deleted',
        orderId: req.params.orderId
    });
});
//Exporting the router
module.exports=router;