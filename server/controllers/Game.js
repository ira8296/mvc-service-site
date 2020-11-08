const models = require('../models');
const file = require('../models/File.js');

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
    if (!req.body.title || !req.body.description || !req.body.image || !req.body.files) {
        return res.status(400).json({ error: 'Title, description, and image are all required' });
    }
    
    const { game } = req.files;
    
    const gameModel = new file.FileModel(game);
    
    const savePromise = gameModel.save();
    
    savePromise.then(() => {
        res.status(201).json({ message: 'Upload Successful'});
    });
    
    savePromise.catch((error) => {
        console.dir(error);
        res.status(400).json({ error: 'The file could not upload'});
    });
    
    const gameData = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        file: savePromise,
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

const downloadFile = (req, res) => {
    file.FileModel.findOne({ })
};

module.exports.posterPage = posterPage;
module.exports.getGames = getGames;
module.exports.post = postGame;
module.exports.download = downloadFile;