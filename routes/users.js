const bcrypt = require('bcrypt');
const lodash = require('lodash');
const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User, validateUser} = require('../models/user');

router.post('/', async (req,res)=>{                 // This function adds a new user at '/api/users'
    const {error} = validateUser(req.body);        // This validates the new user and doesn't allow a wrong one to be posted
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('Tsk, tsk... using the same email twice? Shame on you!');

    let name = await User.findOne({name: req.body.name});
    if (name) return res.status(400).send('We already have a user with this name!');
    
    user = new User(
        lodash.pick(req.body, ['name', 'email', 'password'])
    ); 
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token)
        .send(
        lodash.pick(user, ['name', 'email'])
    );
    console.log('Added a new user: ', req.body.name);
});

module.exports=router;