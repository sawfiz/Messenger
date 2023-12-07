const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  buddies: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

schema
  .pre('find', function() {
    this.populate({
      path: 'buddies',
      select: 'first_name last_name name'
    });
  })
  .pre('findOne', function() {
    this.populate({
      path: 'buddies',
      select: 'first_name last_name name'
    });
  });


module.exports = mongoose.model('Chat', schema);
