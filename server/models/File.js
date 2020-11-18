const mongoose = require('mongoose');

let FileModel = {};

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

FileModel = mongoose.model('FileModel', FileSchema);

module.exports.FileModel = FileModel;
module.exports.FileSchema = FileSchema;
