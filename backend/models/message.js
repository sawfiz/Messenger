const { DateTime } = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  text: { type: String, require: true, maxlength: 240 },
  date: { type: Date },
});

module.exports = mongoose.model('Message', schema);
