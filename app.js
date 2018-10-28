// var session    = require('express-session');
// var MongoStore = require('connect-mongo')(session);
const express = require('express');
var session    = require('express-session');
const config = require('./config');
const log = require('./lib/logger')(__filename,'debug');
const app = express()
  .set('views', `${__dirname}/views`)
  .set('view engine', 'pug')
  .set('port', config.port);



app.use(require('./routes/index'));
app.use(function(err, req, res, next) {
  log.error(err.message);
  res.status(err.status || 500);
  if (res.req.headers['x-requested-with'] === 'XMLHttpRequest') res.json(err);
  else {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.render('error');
  }
});

const async = require('async');

let server = require('http').createServer(app);
let io = require('./lib/socket')(server);

app.set("io", io);
server.on('listening', ()=>{
  log.info(`Listening on ${config.port}`);//3
} );
server.listen(config.port);

