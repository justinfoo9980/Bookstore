const { Cart, validate } = require('../models/cart');
const { Book } = require('../models/book');

// if no cart front end can just display that the cart is empty, i should send res(200)
async function getCart(customerId) {
    const cart = await Cart.findOne({ customer_id: customerId }).populate('items.book_id');
    if (!cart) {
        throw new Error('Cart not found');
    }

    // Calculate total price
    const totalPrice = await calculateTotalPrice(cart._id);
    // Create a new object including totalPrice
    const cartWithTotalPrice = {
        _id: cart._id,
        customer_id: cart.customer_id,
        items: cart.items,
        totalPrice: totalPrice  // Add totalPrice to the response
    };

    return cartWithTotalPrice;
}

//Currently not used, cart created by adding items
async function createCart(customerId) {
    const cart = new Cart({
        customer_id: customerId,
        items: []
    });
    await cart.save();
    return cart;
}

async function addItemToCart(customerId, items) {
    let cart = await Cart.findOne({ customer_id: customerId });
    if (!cart) {    // validation doesnt allow me to add on the fly so this part will not work
        cart = new Cart({
            customer_id: customerId,
            items: items
        });
    } else {
        items.forEach(item => {
            const existingItemIndex = cart.items.findIndex(cartItem => cartItem.book_id.toString() === item.book_id.toString());
            if (existingItemIndex !== -1) { // found a matching item in the cart
                cart.items[existingItemIndex].quantity += item.quantity;
            } else {
                cart.items.push(item);
            }
        });
    }
    await cart.save();
    return cart;
}

async function updateCartItemQuantity(cartId, bookId, quantity) {
    let cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    const cartItem = cart.items.find(item => item.book_id.toString() === bookId);
    if (!cartItem) throw new Error('Book not found in cart');

    cartItem.quantity = quantity;
    await cart.save();
    return cart;
}

async function removeItemFromCart(cartId, bookId) {
    let cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter(item => item.book_id.toString() !== bookId);
    await cart.save();
    return cart;
}

async function calculateTotalPrice(cartId) {
    let cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    let totalPrice = 0;
    for (const item of cart.items) {
        const book = await Book.findById(item.book_id);
        if (book) {
            totalPrice += item.quantity * book.price;
        }
    }
    return totalPrice;
}

async function deleteCart(customerId) {
    const cart = await Cart.findOneAndDelete({ customer_id: customerId });
    if (!cart) throw new Error('Cart not found');
    return cart;
}

//async function addToCart(req, res) {
//    try {
//        const { customerId, items } = req.body;

//        // Calculate total price
//        const totalPrice = calculateTotalPrice(items);

//        // Create or update cart in the database
//        let cart = await Cart.findOne({ customer_id: customerId });
//        if (!cart) {
//            cart = new Cart({
//                customer_id: customerId,
//                items: items
//            });
//        } else {
//            cart.items.push(...items);
//        }

//        await cart.save();

//        res.status(200).json({ cart, totalPrice });
//    } catch (error) {
//        console.error(error);
//        res.status(500).json({ message: 'Server Error' });
//    }
//}

module.exports = {
    getCart,
    createCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    calculateTotalPrice,
    deleteCart
};
