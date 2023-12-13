const { DateTime } = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  chatId: { type: String, require: true, maxlength: 100 },
  text: { type: String, require: true, maxlength: 240 },
  date: { type: Date },
  attachmentUrl: { type: String },
});

schema
  .pre('find', function () {
    this.populate({
      path: 'sender',
      select: 'first_name last_name name',
    });
  })
  .pre('findOne', function () {
    this.populate({
      path: 'sender',
      select: 'first_name last_name name',
    });
  });

module.exports = mongoose.model('Message', schema);
