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
    try {
        const customer = await Customer.findOne({ userId: req.user._id });
        if (!customer) return res.status(404).send('Customer not found');
        const cart = await cartController.getCart(customer._id);
        res.send(cart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const cart = await cartController.getCart(customerId);
        res.send(cart);
    } catch (err) {
        console.error(err);
        //res.status(200).json({ message: 'cart empty' });  // just to tell front end the cart is empty
        res.status(500).send('Server Error');   // if frondend receives this msg at this point, display cart is empty
    }
});

// POST - Create a new cart might not need anyway if i cart when adding items
router.post('/', async (req, res) => {
    //try {
    //    const { customerId } = req.body;

    //    // Create new cart in the database
    //    const cart = new Cart({
    //        customer_id: customerId,
    //        items: []
    //    });

    //    await cart.save();

    //    res.status(201).json({ cart });
    //}
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const { customer_id } = req.body;
        const cart = await cartController.createCart(customer_id);
        res.status(201).json({ cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST - Add a item to the cart
router.post('/addItem', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //try {
    //    let cart = await Cart.findOne({ customer_id: req.body.customer_id });
    //    if (!cart) {
    //        cart = new Cart({
    //            customer_id: req.body.customer_id,
    //            items: req.body.items
    //        });
    //    } else {
    //        cart.items.push(...req.body.items);
    //    }
    //    await cart.save();
    //    res.send(cart);
    //}
    try {
        const { customer_id, items } = req.body;
        const cart = await cartController.addItemToCart(customer_id, items);
        res.send(cart);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// PUT - Update the quantity of a book in the cart
router.put('/:cartId/:bookId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const bookId = req.params.bookId;
        const quantity = req.body.quantity;

        //let cart = await Cart.findById(cartId);
        //if (!cart) return res.status(404).send('Cart not found');

        //const cartItem = cart.items.find(item => item.book_id.toString() === bookId);
        //if (!cartItem) return res.status(404).send('Book not found in cart');

        //cartItem.quantity = quantity;
        //await cart.save();
        //res.send(cart);

        const cart = await cartController.updateCartItemQuantity(cartId, bookId, quantity);
        res.send(cart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// DELETE - Remove a book from the cart
router.delete('/item/:cartId/:bookId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const bookId = req.params.bookId;

        //let cart = await Cart.findById(cartId);
        //if (!cart) return res.status(404).send('Cart not found');

        //cart.items = cart.items.filter(item => item.book_id.toString() !== bookId);
        //await cart.save();
        //res.send(cart);

        const cart = await cartController.removeItemFromCart(cartId, bookId);
        res.send(cart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// DELETE - Delete a user's cart
router.delete('/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const cart = await cartController.deleteCart(customerId);
        res.send(cart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
