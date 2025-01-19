const mongoose = require('mongoose');

// Define the product schema
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: {type: String, required: true}
});

// Export the Product model
module.exports = mongoose.model('Product', productSchema);
