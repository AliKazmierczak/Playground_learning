const Joi = require('joi');
const mongoose = require('mongoose');

const Customers = mongoose.model('Customers', new mongoose.Schema({
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
}));

function validate(customer) {                     //This function is used for validation of requests
    const schema = {
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(5).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
};

exports.Customers = Customers;
exports.validate = validate;