const Cart = require('../models/cart');
const { calculateTotalPrice } = require('./cartController');

async function addToCart(req, res) {
    try {
        const { customerId, items } = req.body;

        // Calculate total price
        const totalPrice = calculateTotalPrice(items);

        // Create or update cart in the database
        let cart = await Cart.findOne({ customer_id: customerId });
        if (!cart) {
            cart = new Cart({
                customer_id: customerId,
                items: items
            });
        } else {
            cart.items.push(...items);
        }

        await cart.save();

        res.status(200).json({ cart, totalPrice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    addToCart
};
