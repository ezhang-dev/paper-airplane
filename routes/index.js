var express = require('express');
var db = require('../db.js');
var fs = require('fs');
var path = require('path');
var multer  = require('multer')

var upload = multer({ dest: 'blob' })


var router = express.Router();

function generatePath(id){
	return path.join("blob",id.toString())
}

/* GET home page. */
router.get('/', function(req, res) {
   res.render('index', { title: 'Express' });
});

router.post('/upload',upload.single('file'), async function(req, res) {
	let id;
	if (req.body.type=="text"){
		let data = {
		'time': new Date(),
		'type': "text",
		'text': req.body.text
		}
		id = await db.add(data)
	}else{
		let data = {
		'time': new Date(),
		'type': "file",
		'text': req.file.originalname,
		}
		id = await db.add(data)
		fs.renameSync(req.file.path,generatePath(id))
	}
	res.send(id.toString());
});

router.put('/upload',async function(req, res) {
	let data = {
		'time': new Date(),
		'type': "file",
		'text': "file"
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

router.get('/:id', function(req, res) {
  res.send(req.data);
});


module.exports = router;
