// Downloads the database needed
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let GameModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

// The schematics or structure for a game
const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  image: {
    type: mongoose.Schema.ObjectId,
    required: true,
    trim: true,
  },

  file: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  postedData: {
    type: Date,
    default: Date.now,
  },
});

// Returns the major data associated with a specific game
GameSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  description: doc.description,
  image: doc.image,
  file: doc.file,
});

// Finds a game by its owner
GameSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return GameModel.find(search).select('title description image file').lean().exec(callback);
};

// Creates new game model using the schematics, and saves it to database
GameModel = mongoose.model('Game', GameSchema);

// Exports the necessary functions
module.exports.GameModel = GameModel;
module.exports.GameSchema = GameSchema;
