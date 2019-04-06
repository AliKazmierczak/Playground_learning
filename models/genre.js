const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 25
    }
});

const Genres = mongoose.model('Genres', genreSchema);

function validateGenre(genre) {             //This function is used for validation of requests
    const schema = {
        name: Joi.string().min(3).max(25).required()
    };
    return Joi.validate(genre, schema);
};

exports.genreSchema = genreSchema;
exports.Genres = Genres;
exports.validateGenre = validateGenre;