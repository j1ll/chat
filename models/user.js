var crypto = require('crypto');
var mongoose = require('mongoose');
let httpError = require('http-errors');
var schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});
const async = require('async');
schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
.set(function(password) {
  this._plainPassword = password;
  this.salt = Math.random() + '';
  this.hashedPassword = this.encryptPassword(password);
})
.get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password, callback) {
  var User = this;
  async.waterfall([
    cb=>User.findOne({username},cb),
    (user,cb)=>{
      if(user){
        if(user.checkPassword(password)){cb(null,user)}
        else{cb(httpError(403,"Пароль неверен"))}
      }else{
        let user = new User({username,password});
        user.save(cb);
      }
    }
  ], callback);
  
};
exports.User = mongoose.model('User', schema);
