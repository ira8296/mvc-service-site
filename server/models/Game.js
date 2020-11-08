const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let GameModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

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
        type: String,
        required: true,
        trim: true,
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

GameSchema.statics.toAPI = (doc) => ({
    title: doc.title,
    description: doc.description,
    image: doc.image,
});

GameSchema.statics.findByOwner = (ownerId, callback) => {
    const search = {
        owner: convertId(ownerId),
    };
    
    return GameModel.find(search).select('title description image').lean().exec(callback);
};

GameModel = mongoose.model('Game', GameSchema);

module.exports.GameModel = GameModel;
module.exports.GameSchema = GameSchema;