const models = require('../models');
const file = require('../models/File.js');

const { Game } = models;

const posterPage = (req, res) => {
  Game.GameModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.dir(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), games: docs });
  });
};

const postGame = (req, res) => {
  if (!req.body.name || !req.body.script || !req.files.image || !req.files.game) {
    return res.status(400).json({ error: 'Title, description, image, and game file are all required' });
  }

  const { game } = req.files.game;

  const { image } = req.files.image;

  if (req.files.game.mimetype !== 'application/zip' || req.files.game.mimetype !== 'application/vnd.rar') {
    return res.status(400).json({ error: 'Incorrect file type - .zip and .rar files only' });
  }

  if (req.files.image.mimetype !== 'image/png' || req.files.image.mimetype !== 'image/jpeg') {
    return res.status(400).json({ error: 'Incorrect file type - .jpg and .png files only' });
  }

  const gameModel = new file.FileModel(game);
  const imgModel = new file.FileModel(image);

  const savePromise = gameModel.save();
  const saveImage = imgModel.save();

  savePromise.then(() => {
    res.status(201).json({ message: 'Upload Successful' });
  });

  savePromise.catch((error) => {
    console.dir(error);
    res.status(400).json({ error: 'The file could not upload' });
  });

  saveImage.then(() => {
    res.status(201).json({ message: 'Upload Successful' });
  });

  saveImage.catch((error) => {
    console.dir(error);
    res.status(400).json({ error: 'The file could not upload' });
  });

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
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ games: docs });
  });
};

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

module.exports.posterPage = posterPage;
module.exports.getGames = getGames;
module.exports.post = postGame;
module.exports.download = downloadFile;
