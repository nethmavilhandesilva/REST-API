const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');//Parses incoming request bodies into JSON or URL-encoded format
const mongoose = require('mongoose');
require('dotenv').config(); //Loads environment variables from a .env file (e.g., database credentials).


const app = express();

// Importing Routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// Connect to MongoDB Atlas
mongoose.connect(
    `mongodb+srv://nethmavilhan:${process.env.MONGO_ATLAS_PW}@node-rest-shop.tsqzi.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('Failed to connect to MongoDB Atlas:', err));

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS Handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes to Handle Requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);  // Ensure this matches with your user routes file

// Error Handling - 404 Not Found
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// General Error Handler
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

module.exports = app;
