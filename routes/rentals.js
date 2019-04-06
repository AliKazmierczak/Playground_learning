const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Rental, validateRental} = require('../models/rental');
const {Movie} = require('../models/movie'); 
const {Customers} = require('../models/customer'); 

Fawn.init(mongoose);

router.get('/', async (req,res)=>{                  //This function returns all existing rentals at '/api/rentals'
    const rentals = await Rental
        .find()
        .sort('-dateOut');        
    res.send(rentals);
});

router.post('/', async (req,res)=>{                 // This function adds a new rental at '/api/rentals'
    const {error} = validateRental(req.body);        // This validates the new rental and doesn't allow a wrong one to be posted
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customers.findById(req.body.customerId);
    if (!customer) return res.status(400).send('There is no such customer!');
  
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send(`We don't have this movie!`);
  
    if (movie.numberInStock === 0) return res.status(400).send('Somebody already took this movie - try again later!');
  
    let rental = new Rental({ 
      customer: {
        _id: customer._id,
        name: customer.name, 
        phone: customer.phone,
        isGold: customer.isGold
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
    });
    try{
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', {_id:movie._id},{
            $inc:{numberInStock:-1}
        })
       // .remove()
        .run();

        res.send(rental);
    }
    catch(ex){
        res.status(500).send('Coś się zjebało...');
    }
    
});

module.exports=router;