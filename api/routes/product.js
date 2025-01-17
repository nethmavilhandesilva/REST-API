//Importing express and creating a router
const express = require('express');
const router = express.Router();
//Handling GET request
router.get('/',(req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});
//Handling POST request
router.post('/',(req, res, next) => {
    res.status(201).json({
        message: 'Handling POST requests to /products'
    });
});
//Add a route to handle GET request
router.patch('/:productId',(req, res, next) =>{
res.status(200).json({
    message: 'Updated product!'
});
});

router.delete('/:productId',(req, res, next) =>{
    res.status(200).json({
        message: 'Deleted product!'
    });
    });
//Exporting the router
module.exports=router;