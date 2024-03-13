const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const express = require('express');
const app = express();

//mongoose.set('useNewUrlParser', true);    // weird. works fine on office machine. need to check package.
/* mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true); */

mongoose.connect('mongodb://localhost/Bookstore')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));