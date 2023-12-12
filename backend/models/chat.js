const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  name: {type: String, required: true},
  customName: {type: Boolean, default: false},
  buddies: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  groupChat: {type: Boolean, default: false},
  photoUrl: { type: String },
  latest: {type: Date}
});

schema
  .pre('find', function() {
    this.populate({
      path: 'buddies',
      select: 'first_name last_name name photoUrl'
    });
  })
  .pre('findOne', function() {
    this.populate({
      path: 'buddies',
      select: 'first_name last_name name photoUrl'
    });
  });


module.exports = mongoose.model('Chat', schema);
