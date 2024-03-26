 const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const Book = mongoose.model('Book', bookSchema);

function validateBook(book) {
    // Input to the API from front end
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId(),
        numberInStock: Joi.number().min(0).required(),
        price: Joi.number().min(0).required()
    });

    return schema.validate(book);
}

exports.bookSchema = bookSchema;
exports.Book = Book;
exports.validate = validateBook; 