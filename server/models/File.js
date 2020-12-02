// Downloads the database needed
const mongoose = require('mongoose');

let FileModel = {};

// The schematics or structure for a file
// AKA - the file's data
const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  data: {
    type: Buffer,
  },
  size: {
    type: Number,
  },
  encoding: {
    type: String,
  },
  tempFilePath: {
    type: String,
  },
  truncated: {
    type: Boolean,
  },
  mimetype: {
    type: String,
  },
  md5: {
    type: String,
  },
});

// Creates new file model out of the file's data, and saves it to database
FileModel = mongoose.model('FileModel', FileSchema);

// Exports the necessary functions
module.exports.FileModel = FileModel;
module.exports.FileSchema = FileSchema;
