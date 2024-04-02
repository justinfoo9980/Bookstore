const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const books = require('../routes/books');
const users = require('../routes/users');
const orders = require('../routes/orders');
const carts = require('../routes/carts');
const auth = require('../routes/auth');

module.exports = function (app) {
    app.use(express.json());
    app.use('/genres', genres);
    app.use('/customers', customers);
    app.use('/books', books);
    app.use('/users', users);
    app.use('/orders', orders);
    app.use('/carts', carts);
    app.use('/auth', auth);
}