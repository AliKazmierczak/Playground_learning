const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre:{
        type: genreSchema,
        required: true
    },
    numberInStock:{
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        min: 0,
        max: 255   
    }
}));

function validateMovie(movie) {             //This function is used for validation of requests
    const schema = {
        title: Joi.string().min(3).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(0),
        dailyRentalRate: Joi.number().min(0).required(0)
    };
    return Joi.validate(movie, schema);
};

exports.Movie = Movie;
exports.validateMovie = validateMovie;