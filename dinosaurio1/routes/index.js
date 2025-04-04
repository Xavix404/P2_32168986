var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(_req, res, next) {
  res.render('index', { 
    title: 'DinosaurApp',
    name: 'Victor Xavier Misel Marquez',
    ci: '32168986',
    section: '4'
  });
});

module.exports = router;
