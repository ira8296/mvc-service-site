// The instances for the models
const models = require('../models');
const file = require('../models/File.js');

const { Game } = models;

// Returns the user page
const posterPage = (req, res) => {
  Game.GameModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.dir(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), games: docs });
  });
};

// Displays any game the user posts onto their personal page and the arcade page
const postGame = (req, res) => {
  // Checks if the user has filled in the required fields
  if (!req.body.name || !req.body.script || !req.files.image || !req.files.game) {
    return res.status(400).json({ error: 'Title, description, image, and game file are all required' });
  }

  // List of acceptable game file types
  const mimeTypes = [
    'application/zip',
    'application/vnd.rar',
    'application/x-7z-compressed',
    'application/x-zip-compressed',
    'application/x-gzip',
    'application/octet-stream',
    'multipart/x-zip',
    'application/x-rar-compressed',
    'application/octet-stream',
  ];

  const imageTypes = ['image/png', 'image/jpeg']; // List of acceptable image file types

  // Checks if the user used the correct file types for the image and game fields
  if (mimeTypes.includes(req.files.game.mimetype) === false) {
    return res.status(400).json({ error: 'Incorrect file type - .zip and .rar files only' });
  }

  if (imageTypes.includes(req.files.image.mimetype) === false) {
    return res.status(400).json({ error: 'Incorrect file type - .jpg and .png files only' });
  }

  // Handles the file uploading process
  const gameModel = new file.FileModel(req.files.game);
  const imgModel = new file.FileModel(req.files.image);

  // Gets the instances of the image and game files,
  // saving and storing them in one promise
  const savePromise = gameModel.save();
  const saveImage = imgModel.save();
  const allPromises = Promise.all([savePromise, saveImage]);

  // Upon the promise's success, all the enetered data is used to create
  // a new GameModel, which is then saved to the database
  allPromises.then(() => {
    const gameData = {
      title: req.body.name,
      description: req.body.script,
      image: imgModel._id,
      file: gameModel._id,
      owner: req.session.account._id,
    };

    const newGame = new Game.GameModel(gameData);

    const gameSave = newGame.save();

    gameSave.then(() => res.json({ redirect: '/maker' }));

    // If the saving process encounters an error, an error code and message is returned
    gameSave.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Game already exists.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });

    return gameSave;
  });

  // If the promise encounters an error, an error code and message is returned
  return allPromises.catch(() => {
    res.status(400).json({ error: 'The files could not upload' });
  });
};

// Finds games owned by the current user
const getGames = (request, response) => {
  const req = request;
  const res = response;

  return Game.GameModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ games: docs });
  });
};

// Returns all games saved in the database
const getAllGames = (request, response) => {
  const res = response;

  return Game.GameModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ games: docs });
  });
};

// Called whenever a file is downloaded from the site
const downloadFile = (req, res) => {
  if (!req.query.fileId) {
    return res.status(400).json({ error: 'File cannot be found ' });
  }
  return file.FileModel.findOne({ _id: req.query.fileId }, (error, doc) => {
    if (error) {
      console.dir(error);
      return res.status(400).json({ error: 'An error occurred downloading the file' });
    }

    if (!doc) {
      return res.status(400).json({ error: 'File not found' });
    }

    res.writeHead(200, { 'Content-Type': doc.mimetype, 'Content-Length': doc.size });
    return res.end(doc.data);
  });
};

// All necessary functions are exported
module.exports.posterPage = posterPage;
module.exports.getGames = getGames;
module.exports.getAll = getAllGames;
module.exports.post = postGame;
module.exports.download = downloadFile;
