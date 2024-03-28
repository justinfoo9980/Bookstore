const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Order, validate } = require('../models/order');
const { User } = require('../models/user');
const { Book } = require('../models/book');
const { Customer } = require('../models/customer')
const { Cart } = require('../models/cart')
const cartController = require('../controllers/cartController');
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
    //const orders = await Order.find({userId: req.body.userId});
    //res.send(orders);


    try {
        const customer = await Customer.findOne({ userId: req.user._id });
        if (!customer) return res.status(404).send('Customer not found');
        const order = await Order.findOne({ 'order.customer_id': customer._id }).populate('order.items.book_id');
        if (!order) {
            throw new Error('Order not found');
        }
        res.send(order);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

/**
 * Create a new order
 * Method: POST
 */
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const cart = await Cart.findById(req.body.cartId);

    if (!cart)
        return res.status(400).send('Invalid cart.');

    const totalPrice = await cartController.calculateTotalPrice(req.body.cartId);
    let order = new Order({
        order: cart,
        totalCost: totalPrice,
        shippingAddress: req.body.shippingAddress,
        billingAddress: req.body.billingAddress
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