const mongoose = require('mongoose');

// Define the order schema (not product)
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
});

// Export the Order model (not Product)
module.exports = mongoose.model('Order', orderSchema);
