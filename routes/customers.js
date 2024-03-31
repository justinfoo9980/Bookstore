const auth = require('../middleware/auth');
const { Customer, validate } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

//no longer needed as customer created by registering user
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        defaultShippingAddress: req.body.defaultShippingAddress,
        defaultBillingAddress: req.body.defaultBillingAddress
    });
    customer = await customer.save();

    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    //const updateFields = {};
    //if (req.body.name) updateFields.name = req.body.name;
    //if (req.body.defaultShippingAddress) updateFields.defaultShippingAddress = req.body.defaultShippingAddress;
    //if (req.body.defaultBillingAddress) updateFields.defaultBillingAddress = req.body.defaultBillingAddress;

    //const customer = await Customer.findByIdAndUpdate(req.params.id,
    //    updateFields,
    //    { new: true });

    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            defaultShippingAddress: req.body.defaultShippingAddress,
            defaultBillingAddress: req.body.defaultBillingAddress
        }, { new: true });

    if (!customer)
        return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer)
        return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

router.get('/me', auth, async (req, res) => {
        const customer = await Customer.findOne({ userId: req.user._id });
        if (!customer) return res.status(404).send('Customer not found');
        res.send(customer);
});

//anything with :id must be placed last  else it will confuse to think that the string is the :id
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer)
        return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

module.exports = router; 