const auth = require('../middleware/auth');
const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genres, validateGenre} = require('../models/genre');

const ObjectId = mongoose.Types.ObjectId;


router.get('/', async (req,res)=>{                  //This function returns all existing genres at '/api/genres'
    const genres = await Genres
        .find()
        .sort('name');
    res.send(genres);
});

router.post('/', auth, async (req,res)=>{                 // This function adds a new genre at '/api/genres'
    const {error} = validateGenre(req.body);        // This validates the new genre and doesn't allow a wrong one to be posted
    if (error) return res.status(400).send(error.details[0].message);

    const old = await Genres.findOne({name: req.body.name});    //This checks whether the new genre isn't the same as an existing one
    if (old) {                                      // This doesn't allow for an old genre to be added again
        console.log('Genre already exists');
        return res.send('We already have this genre - think harder RETARD!');
    }
    
    let genre = new Genres({ name: req.body.name}); //If a new genre is unique it is added to database
    await genre.save();

    res.send(genre);
    console.log('Added a new genre: ', req.body.name);
});

router.put('/:id', auth, async (req,res)=>{           //This function alows to edit a genre at '/api/genres/:id'
    if (!ObjectId.isValid(req.params.id)) return res.status(422).send('Nie umiesz wpisać ID?! HAHAHAHA!! N00B LOL!! xD');

    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new:true});
    if(!genre) return res.status(404).send("Fuck... that one we don't have... Try again later?");

    res.send(genre);
});

router.delete('/:id', auth, async (req,res)=>{        //This function alows to delete a genre at '/api/genres/:id'
    if (!ObjectId.isValid(req.params.id)) return res.status(422).send('Nie umiesz wpisać ID?! HAHAHAHA!! N00B LOL!! xD');

    const genre = await Genres.findByIdAndDelete(req.params.id);
    if(!genre) return res.status(404).send("Fuck... that one we don't have... Try again later?");

    res.send(genre);
});

router.get('/:id', async (req,res)=>{       //This function alows to return a genre at '/api/genres/:id'
    if (!ObjectId.isValid(req.params.id)) return res.status(422).send('Nie umiesz wpisać ID?! HAHAHAHA!! N00B LOL!! xD');

//    const {error} = validateGenre(req.body);
//    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findById(req.params.id);
    if(!genre) return res.status(404).send('This type of genre does not exist - try again! Sucker! xD');
    
    res.send(genre);    
});

module.exports=router;

