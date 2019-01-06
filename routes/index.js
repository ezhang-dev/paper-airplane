var express = require('express');
var db = require('../db.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});
router.put('/upload',function(req, res, next) {
  if (req.headers.expect=="")
  console.log(req.rawBody);
  next();
});
router.param('id', async function(req, res, next, id) {
  var data = await db.get(id);
  if (data) {
      req.data = data;
      next();
    } else {
      next(new Error('failed to find data'));
    }
});

router.get('/:id', function(req, res, next) {
  res.send(req.data);
});


module.exports = router;
