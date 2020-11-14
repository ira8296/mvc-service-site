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
        return res.status(400).json({ error: 'Title, description, image, and file are all required' });
    }
    
    const { game } = req.files;
    
    if(file.FileModel(game) != "application/x-7z-compressed" || file.FileModel(game) != "application/vnd.rar") {
        return res.status(400).json({ error: 'Incorrect file type - .zip and .rar files only'});
    }
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
        file: gameModel._id,
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
    if(!req.query.fileId){
        return res.status(400).json({ error: 'File cannot be found '});
    }
    file.FileModel.findOne({ _id: req.query.fileId }, (error, doc) => {
        if(error) {
            console.dir(error);
            return res.status(400).json({ error: 'An error occurred downloading the file'});
        }
        
        if(!doc){
            return res.status(400).json({ error: 'File not found' });
        }
        
        res.writeHead(200, {'Content-Type': doc.mimetype, 'Content-Length': doc.size});
        return res.end(doc.data);
    });
};

module.exports.posterPage = posterPage;
module.exports.getGames = getGames;
module.exports.post = postGame;
module.exports.download = downloadFile;