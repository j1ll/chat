const log = require('./logger')(__filename,'debug');
const getSessionUsername = require('./sidToUsername');

function parseSocketCookies(socket,next) {
  require('cookie-parser')("asdasd666")(socket.request, socket.request.res, next);
}

module.exports = function (server) {
  let io = require('socket.io')(server,{
    origins: "localhost:3000",
    cookie: false,
  });
  io.use(parseSocketCookies); //сработает и при реконнекте
  
  io.on('connection', function (socket) {
    let sid = socket.request.signedCookies.sid2;
    function emitError(err) {
      log.error(err.message);
      socket.emit('error',err);
      socket.disconnect();
    }
    socket.on('message', function (clientUsername, text, cb) {
      log.debug(socket.rooms);
      let callback = function (err,username) {
        if(err) return emitError(err);
        if(username===clientUsername) {
          io.emit('message',username, text);
          cb&&cb(false);
        } else {
          cb&&cb(username);
        }
      };
      getSessionUsername(sid,callback);
    });
    socket.on('checkUsername', function (cb) {
      getSessionUsername(sid, function (err,username) {
        if(err) return emitError(err);
        cb(username);
      })
    });
    socket.on('error', function(err){log.error(err.message,{line:93})});
  });
  return io;
};