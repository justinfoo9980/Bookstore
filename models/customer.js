const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    // Input to the API from front end
    const schema = Joi.object({
        customerId: Joi.objectId(),
        name: Joi.string().min(5).max(50).required(),
        defaultShippingAddress: Joi.string().min(5).max(100),
        defaultBillingAddress: Joi.string().min(5).max(100)
    });

    return schema.validate(customer);
}

exports.customerSchema = customerSchema;
exports.Customer = Customer; 
exports.validate = validateCustomer;
