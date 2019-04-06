const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Movie: Movie, validateMovie: validateMovie} = require('../models/movie');
const {Genres: Genres} = require('../models/genre');
const auth = require('../middleware/auth');

const ObjectId = mongoose.Types.ObjectId;


router.get('/', async (req,res)=>{                  //This function returns all existing movies at '/api/movie'
    const movies = await Movie
        .find();        
    res.send(movies);
});

router.post('/', auth, async (req,res)=>{                 // This function adds a new movie at '/api/movie'
    const {error} = validateMovie(req.body);        // This validates the new movie and doesn't allow a wrong one to be posted
    if (error) return res.status(400).send(error.details[0].message);

    const old = await Movie.findOne({title: req.body.title});    //This checks whether the new movie isn't the same as an existing one
    if (old) {                                      // This doesn't allow for an old movie to be added again
        console.log('Movie already exists');
        return res.send('We already have this movie - think harder RETARD!');
    }

    const genre = await Genres.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');
    
    let movie = new Movie({                 //If a new movie is unique it is added to database
        title: req.body.title,
        genre: {
            _id:genre._id,
            name:genre.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }); 
    await movie.save();

    res.send(movie);
    console.log('Added a new movie: ', req.body.title);
});

router.put('/:id', auth, async (req,res)=>{           //This function alows to edit a movie at '/api/movie/:id'
    if (!ObjectId.isValid(req.params.id)) return res.status(422).send('Nie umiesz wpisać ID?! HAHAHAHA!! N00B LOL!! xD');

    const {error} = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id:genre._id,
            name:genre.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, {new:true});
    if(!movie) return res.status(404).send("Fuck... that one we don't have... Try again later?");

    res.send(movie);
});

router.delete('/:id', auth, async (req,res)=>{        //This function alows to delete a movie at '/api/movie/:id'
    if (!ObjectId.isValid(req.params.id)) return res.status(422).send('Nie umiesz wpisać ID?! HAHAHAHA!! N00B LOL!! xD');

    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie) return res.status(404).send("Fuck... that one we don't have... Try again later?");

    res.send(movie);
});

router.get('/:id', async (req,res)=>{       //This function alows to return a movie at '/api/movie/:id'
    if (!ObjectId.isValid(req.params.id)) return res.status(422).send('Nie umiesz wpisać ID?! HAHAHAHA!! N00B LOL!! xD');

    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('This type of genre does not exist - try again! Sucker! xD');
    
    res.send(movie);    
});

module.exports=router;