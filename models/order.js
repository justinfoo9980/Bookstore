const Joi = require('joi');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            email: {
                type: String,
                required: true,
                minLength: 5,
                maxLength: 50
            }
        }),
        required: true
    },
    //name: {
    //    type: Schema.Types.ObjectId,
    //    ref: 'User',  //have to import user model, const User = require('./user');
    //    required: true
    //},
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
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
    },
    totalCost: {
        type: Number,
        required: true,
        min: 0
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
        userId: Joi.objectId(),
        shippingAddress: Joi.string().min(5).max(100).required(),
        billingAddress: Joi.string().min(5).max(100).required(),
        bookId: Joi.objectId(),
        totalCost: Joi.number().min(0).required()
    });

    return schema.validate(order);
}

exports.Order = Order;
exports.validate = validateOrder; 