//This code defines a Mongoose schema and model for an Order in a MongoDB database. Here's a detailed explanation:

const mongoose = require('mongoose');//Import mongoosa

// Define the order schema (not product)
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
});

// Export the Order model (not Product)
module.exports = mongoose.model('Order', orderSchema);
