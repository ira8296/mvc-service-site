const models = require('../models');

const { Game } = models;

const posterPage = (req, res) => {
    Game.GameModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        
        return res.render('app', { csrfToken: req.csrfToken(), games: docs });
    });
};

const postGame = (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.image) {
        return res.status(400).json({ error: 'Title, description, and image are all required' });
    }
    
    const gameData = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        owner: req.session.account._id,
    };
    
    const newGame = new Game.GameModel(gameData);
    
    const gameSave = newGame.save();
    
    gameSave.then(() => res.json({ redirect: '/maker' }));
    
    gameSave.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Game already exists.' });
        }
        
        return res.status(400).json({ error: 'An error occurred' });
    });
    
    return gameSave;
};

const getGames = (request, response) => {
    const req = request;
    const res = response;
    
    return Game.GameModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({error: 'An error occurred'});
        }
        
        return res.json({ games: docs });
    });
};

module.exports.posterPage = posterPage;
module.exports.getGames = getGames;
module.exports.post = postGame;