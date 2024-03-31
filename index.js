require('express-async-errors');
const config = require('config');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const books = require('./routes/books');
const users = require('./routes/users');
const orders = require('./routes/orders');
const carts = require('./routes/carts');


const auth = require('./routes/auth');
const express = require('express');
const app = express();
require('./startup/validation')();

//mongoose.set('useNewUrlParser', true);    // weird. works fine on office machine. need to check package.
/* mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true); */

if (!config.get('jwtPrivateKey')) {
    console.error('Please add jwtPrivateKey into your env variable')
    process.exit(1);
}

mongoose.connect('mongodb://localhost/Bookstore')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/genres', genres);
app.use('/customers', customers);
app.use('/books', books);
app.use('/users', users);
app.use('/orders', orders);
app.use('/carts', carts);
app.use('/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));