var express = require('express');
var db = require('../module/db.js');
var file = require('../module/file.js');
var autolinker = require('autolinker');
var multer  = require('multer')

var upload = multer({ dest: 'blob' })

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
   res.render('index');
});

router.post('/upload',upload.single('file'), async function(req, res, next) {
	let id;
	if (req.body.type=="text"){
		if(!req.body.text)req.body.text="";
		id = await db.insertText(req.body.text)
	}else{
		if(!req.file) next(new Error('No File Selected'));
		id = await db.insertFile(req.file.originalname)
		file.moveFile(req.file.path,id);
	}
	res.render('upload',{url:req.protocol + '://' + req.get('host') + '/' + id.toString()});
});

router.put('/upload/:name?',async function(req, res, next) {
	if (!req.params.name) req.params.name="file"
	let id = await db.insertFile(req.params.name)
    req.pipe(file.writeStream(id))
    .on('error', (err) => next(err))
    .on('close', () => {
      res.send(id.toString());
    })
});

router.param('id', async function(req, res, next, id) {
  if(isNaN(parseInt(id))) return next(new Error('Not a valid id'));
  var data = await db.get(id);
  if (data) {
      req.data = data;
      next();
    } else {
      next(new Error('failed to find data'));
    }
});

router.get('/:id(\\d+)', function(req, res) {
  if(req.data.type=="file"){
	res.download(file.generatePath(req.data.id),req.data.content)
  }else{
	res.render('view',{text:autolinker.link(req.data.content.replace(/</g,"&lt").replace(/>/g,"&gt"))})
  }
});


module.exports = router;
