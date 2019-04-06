const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Customers, validate} = require('../models/customer');

const ObjectId = mongoose.Types.ObjectId;

router.get('/', async (req,res)=>{                  //This function returns all existing customers at '/api/customers'
    const customers = await Customers
        .find()
        .sort('name');
    res.send(customers);
});

router.post('/', async (req,res)=>{                 // This function adds a new customer at '/api/customers'
    const {error} = validate(req.body);        // This validates the new customer and doesn't allow a wrong one to be posted
    if (error) return res.status(400).send(error.details[0].message);

    const old = await Customers.findOne({       //This checks whether the new customer isn't the same as an existing one
        name: req.body.name,
        phone: req.body.phone
    });    
    if (old) {                                      // This doesn't allow for an old customer to be added again
        console.log('That person already exists in database');
        return res.send('We already have this customer - NO multiaccounts CHEATER!');
    }
    
    let customer = new Customers({          //If a new customer is unique it is added to database
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }); 
    await customer.save();

    res.send(customer);
    console.log('Added a new customer: ', req.body.name);
});

router.put('/:id', async (req,res)=>{           //This function alows to edit a customer at '/api/customers/:id'
    if (!ObjectId.isValid(req.params.id)) return res.status(422).send('Nie umiesz wpisać ID?! HAHAHAHA!! N00B LOL!! xD');

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customers.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, {new:true});
    if(!customer) return res.status(404).send("Fuck... that one we don't have... Try again later?");

    res.send(customer);
});

router.delete('/:id', async (req,res)=>{        //This function alows to delete a customer at '/api/customers/:id'
    if (!ObjectId.isValid(req.params.id)) return res.status(422).send('Nie umiesz wpisać ID?! HAHAHAHA!! N00B LOL!! xD');

    const customer = await Customers.findByIdAndDelete(req.params.id);
    if(!customer) return res.status(404).send("Whelp - we won't be deleting that one - it never existed!");

    res.send(customer);
});

router.get('/:id', async (req,res)=>{       //This function alows to return a customer at '/api/customers/:id'
    if (!ObjectId.isValid(req.params.id)) return res.status(422).send('Nie umiesz wpisać ID?! HAHAHAHA!! N00B LOL!! xD');

    const customer = await Customers.findById(req.params.id);
    if(!customer) return res.status(404).send('This type of genre does not exist - try again! Sucker! xD');
    
    res.send(customer);    
});

module.exports=router;