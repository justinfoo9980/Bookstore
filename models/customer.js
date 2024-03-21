const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    defaultShippingAddress: {
        type: String,
        minlength: 5,
        maxlength: 100
    },
    defaultBillingAddress: {
        type: String,
        minlength: 5,
        maxlength: 100
    }
}));

function validateCustomer(customer) {
    // Input to the API from front end
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        defaultShippingAddress: Joi.string().min(5).max(100),
        defaultBillingAddress: Joi.string().min(5).max(100)
    });

    return schema.validate(customer);
}

exports.Customer = Customer; 
exports.validate = validateCustomer;

//todo export schema for customer