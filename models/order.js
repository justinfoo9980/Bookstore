const Joi = require('joi');
const mongoose = require('mongoose');
const { userSchema } = require('./user');
const { bookSchema } = require('./book');

const orderSchema = new mongoose.Schema({
    user: {
        type: userSchema,
        required: true
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    shippingAddress: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    billingAddress: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    book: {
        type: bookSchema,
        required: true
    },
    totalCost: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        default: "Pending Order"
    }
});

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
    // Input to the API from front end
    const schema = Joi.object({
        userId: Joi.objectId(),
        shippingAddress: Joi.string().min(5).max(50).required(),
        billingingAddress: Joi.string().min(5).max(50).required(),
        bookId: Joi.objectId(),
        totalCost: Joi.number().min(0).required()
    });

    return schema.validate(order);
}