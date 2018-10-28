const router = require('express').Router();
// const users = require('../controllers/users');
// const {User} = require('../models/user');
// let httpError = require('http-errors');
// const log = require('../../lib/log');

router.get('/', function (req,res,next) {
  res.render('posts')
});
router.get('/:id', function (req,res,next) {
  res.send(req.params)
});
module.exports=router;