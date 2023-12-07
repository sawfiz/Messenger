const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  buddies: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Chat', schema);
