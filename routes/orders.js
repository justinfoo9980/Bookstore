const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Order, validate } = require('../models/order');
const { User } = require('../models/user');
const { Book } = require('../models/book');
const { Customer } = require('../models/customers')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/**
 * Route to get all orders
 * Method: GET
 */
router.get('/', async (req, res) => {
    const orders = await Order.find().sort('orderDate');
    res.send(orders);
});

/**
 * Route to get own orders
 * Method: GET
 * Requires: Logged in
 */
router.get('/me', auth, async (req, res) => {
    const orders = await Order.find({userId: req.body.userId});
    res.send(orders);
});

/**
 * Create a new order
 * Method: POST
 */
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const book = await Book.findById(req.body.bookId);

    if (!book)
        return res.status(400).send('Invalid book.');

    const user = await User.findById(req.body.userId);

    if (!user)
        return res.status(400).send('Invalid user.');

    // todo where i left off have to edit the schema in order to not import the whole thing(the user fields like password). should ownself define
    let order = new Order({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        shippingAddress: req.body.shippingAddress,
        billingAddress: req.body.billingAddress,
        book: {
            _id: book._id,
            name: book.name
        },
        totalCost: req.body.totalCost
    });
    order = await order.save();

    res.send(order);
});

/**
* Route to edit order
* Method: PUT
*/

/**
* Route to delete order
* Method: DELETE
*/

module.exports = router;