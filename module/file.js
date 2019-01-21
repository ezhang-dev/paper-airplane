var fs = require('fs');
var path = require('path');

function generatePath(id){
	return path.join("blob",id.toString())
}

function writeStream(id){
	return fs.createWriteStream(generatePath(id),{flags:"w+"})
}

function moveFile(path,id){
	fs.renameSync(path,generatePath(id))
}

function deleteFile(id){
	fs.unlinkSync(generatePath(id))
}

module.exports={writeStream,moveFile,deleteFile,generatePath}