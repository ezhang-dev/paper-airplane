var express = require('express');
var db = require('../db.js');
var fs = require('fs');
var path = require('path');

var repl = require('repl')

var router = express.Router();

function generatePath(id){
	return path.join("blob",id.toString())
}


/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});
router.put('/upload',async function(req, res, next) {
	global.req=req
	repl.start({useGlobal : true})
	console.dir(req)
	let data = {
		'time': new Date(),
		'type': "file",
		'name': "file"
	};
	let id = await db.add(data)
    req.pipe(fs.createWriteStream(generatePath(id),{flags:"w+"}))
    .on('error', (err) => next(err))
    .on('close', () => {
      res.send(id.toString());
    })
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
