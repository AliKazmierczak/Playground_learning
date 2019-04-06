const bcrypt = require('bcrypt');
const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const {User} = require('../models/user');

router.post('/', async (req,res)=>{             //This is for logins
    const {error} = validate(req.body);        // This validates the data put in and doesn't allow an invalid type
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});     //This function checks whether the email is the same as the one in database
    if (!user) return res.status(400).send('Nope! The password or email is invalid - try again!');

    const validPassword = await bcrypt.compare(req.body.password, user.password); //This function compares and decrypts password in database and given from user
    if (!validPassword) return res.status(400).send('Nope! The password or email is invalid - try again!');

    const token = user.generateAuthToken();

    res.send(token);

});

function validate(req) {             //This function is used for validation of requests
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    };
    return Joi.validate(req, schema);
}

module.exports=router;