const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Cart, validate } = require('../models/cart');
const { Customer } = require('../models/customer');
const cartController = require('../controllers/cartController');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET - Retrieve a user's cart


router.get('/me', auth, async (req, res) => {
    const customer = await Customer.findOne({ userId: req.user._id });
    if (!customer) return res.status(404).send('Customer not found');
    const cart = await cartController.getCart(customer._id);
    res.send(cart);
});

router.get('/:customerId', async (req, res) => {
    const customerId = req.params.customerId;
    const cart = await cartController.getCart(customerId);
    res.send(cart);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { customer_id } = req.body;
    const cart = await cartController.createCart(customer_id);
    res.status(201).json({ cart });

});

// POST - Add a item to the cart
router.post('/addItem', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { customer_id, items } = req.body;
    const cart = await cartController.addItemToCart(customer_id, items);
    res.send(cart);
});

// PUT - Update the quantity of a book in the cart
router.put('/:cartId/:bookId', async (req, res) => {
    const cartId = req.params.cartId;
    const bookId = req.params.bookId;
    const quantity = req.body.quantity;

    const cart = await cartController.updateCartItemQuantity(cartId, bookId, quantity);
    res.send(cart);
});

// DELETE - Remove a book from the cart
router.delete('/item/:cartId/:bookId', async (req, res) => {
    const cartId = req.params.cartId;
    const bookId = req.params.bookId;

    const cart = await cartController.removeItemFromCart(cartId, bookId);
    res.send(cart);
});

// DELETE - Delete a user's cart
router.delete('/:customerId', async (req, res) => {
    const customerId = req.params.customerId;
    const cart = await cartController.deleteCart(customerId);
    res.send(cart);
});

module.exports = router;
