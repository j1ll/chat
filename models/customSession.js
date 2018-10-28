var crypto = require('crypto');

var mongoose = require('mongoose');
var {ObjectID} = require('mongodb');

function setExpiresDate() {
  return new Date(Date.now()+(1000*60*60*24*7))
}


var schema = new mongoose.Schema({
  expires: {
    type: Date,
    default: setExpiresDate
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: new ObjectID("5b5b6b843ff7966ceba1a0b4"),
  }
  
});

schema.virtual('userStrId')
.set(function(userStrId) {
  this.userId = new ObjectID(userStrId);
})
.get(function() { return this.userId.toString() });



exports.CustomSession = mongoose.model('CustomSession', schema);
