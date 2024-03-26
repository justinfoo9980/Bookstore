const Joi = require('joi');
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const cartSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);

function validateCart(cart) {
    const schema = Joi.object({
        customer_id: Joi.objectId(),
        items: Joi.array().items(Joi.object({
            book_id: Joi.objectId(),
            quantity: Joi.number().min(1).required()
        }))//.min(1).required()
    });

    return schema.validate(cart);
}

exports.cartSchema = cartSchema;
exports.Cart = Cart;
exports.validate = validateCart; 