const Joi = require('joi');
const mongoose = require('mongoose');
const { cartSchema } = require('./cart');

const orderSchema = new mongoose.Schema({
    order: {
        type: cartSchema,
        required: true
    },
    totalCost: {
        type: Number,
        required: true,
        min: 0
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
    status: {
        type: String,
        required: true,
        default: 'Pending Order',
        enum: ['Pending Order', 'Completed']
    }
});

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
    // Input to the API from front end
    const schema = Joi.object({
        cartId: Joi.objectId(),
        //total cost calculated by backend
        shippingAddress: Joi.string().min(5).max(100).required(),
        billingAddress: Joi.string().min(5).max(100).required()
        
    });

    return schema.validate(order);
}
exports.orderSchema = orderSchema;
exports.Order = Order;
exports.validate = validateOrder; 