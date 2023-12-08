const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  name: {type: String, required: true},
  buddies: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  groupChat: {type: Boolean, default: false}
});

module.exports = mongoose.model('Chat', schema);
