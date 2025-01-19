// Importing express and creating a router
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');  // Corrected to use 'Product' as it should be a model

// Handle request to fetch all orders and send a response with status code and a message
router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product','name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

// Handle request to create a new order and send a response with status and a message
router.post('/', (req, res, next) => {
  const productId = req.body.productId;

  // Check if the productId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: 'Invalid productId'
    });
  }

  // If the productId is valid, proceed with finding the product
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }

      const order = new Order({
        _id: new mongoose.Types.ObjectId(),  // Corrected: Use 'new' to create ObjectId
        quantity: req.body.quantity,
        product: productId  // Product ID is now guaranteed to be valid
      });

      order.save()
        .then(result => {
          res.status(201).json({
            message: 'Order was created successfully',
            createdOrder: {
              _id: result._id,
              product: result.product,
              quantity: result.quantity
            },
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + result._id  // Corrected reference to result._id
            }
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Error finding product',
        error: err
      });
    });
});

// Handle request to fetch details of a specific order by its ID
router.get('/:orderId', (req, res, next) => {
 Order.findById(req.params.orderId)
  .populate('product')
 .exec()
 .then(order =>{
    res.status(200).json({
        order: order,
        request: {
            type: 'GET',
            url: 'http://localhost:3000/orders'
        }
    })
 })
 .catch(err =>{
    res.status(500).json({
        error:err

    });
 });
});

router.delete('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;
  
    // Check if the orderId is valid
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: 'Invalid orderId format'
      });
    }
  
    // Use findByIdAndDelete to remove the order
    Order.findByIdAndDelete(orderId)
      .then(result => {
        if (!result) {
          // If no order is found, return a 404 error
          return res.status(404).json({
            message: "Order not found"
          });
        }
  
        // If the order is found and deleted, return a success message
        res.status(200).json({
          message: "Order deleted",
          request: {
            type: "POST",
            url: "http://localhost:3000/orders",
            body: { productId: "ID", quantity: "Number" }
          }
        });
      })
      .catch(err => {
        // Log the error to debug
        console.error("Error deleting order:", err);
  
        // Handle any error that occurs during deletion
        res.status(500).json({
          message: 'Error occurred while deleting the order',
          error: err
        });
      });
  });
  
  
  


// Exporting the router
module.exports = router;
