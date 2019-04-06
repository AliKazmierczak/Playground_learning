const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50
        },
        isGold: {
            type: Boolean,
            default: false
        },
        phone: {
            type: String,
            required: true,
            minlength: 5
        }
    },
    movie: {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 255
        },
        dailyRentalRate:{
            type: Number,
            required: true,
            min: 0,
            max: 255   
        }
    },
    dateOut:{
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned:{
        type: Date
    },
    rentalFee:{
        type: Number,
        default: 5,
        min: 0
    }
}));

function validateRental(rental) {
    const schema = {
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required()
    };
  
    return Joi.validate(rental, schema);
  }
  
  exports.Rental = Rental; 
  exports.validateRental = validateRental;