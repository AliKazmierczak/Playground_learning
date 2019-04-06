const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength:255,
    },
    email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength:255,
        unique: true

    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength:1024
    }
});

userSchema.methods.generateAuthToken() = function(){        //w ten sposób tworzymy nową metodę, którą będzie można używać gdzie indziej
    const token = jwt.sign({_id:this._id}, config.get('vidlyKey'));
    return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {             //This function is used for validation of requests
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validateUser = validateUser;