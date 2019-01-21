var randomNumber = require("random-number-csprng");
var sqlite3 = require('sqlite3').verbose();

var type_enum=["text","file"];

var db = new sqlite3.Database('data.db')

db.run("CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY, type INTEGER, expire INTEGER, content TEXT);");

var getQuery = db.prepare("SELECT id, type, content FROM data WHERE id = ? LIMIT 1")
async function get(id){
	return new Promise(function(resolve, reject){
		getQuery.get([id],function(err,row){
			getQuery.reset();
			if(err){
				reject(err)
			}else{
				if(row)row.type=type_enum[row.type];
				resolve(row)
			}
		})
	})
}

var insertQuery = db.prepare("INSERT INTO data (id,type,expire,content) VALUES (?,?,?,?)")

async function insert({type,content}){
	let id = await randomNumber(1, 9999);
	if (await get(id)) return insert({type,content});
	var today = new Date();
	today.setHours(today.getHours() + 1);
	return new Promise(function(resolve, reject){
		insertQuery.run([id,type,today.getTime(),content],function(err){
			if(err){
				reject()
			}else{
				resolve(id)
			}
		})
	})
}

async function insertText(content){
  return await insert({type:0,content})
}

async function insertFile(name){
  return await insert({type:1,content:name})
}

var findExpiredQuery = db.prepare("SELECT id,type from data where expire < ?")
var deleteExpiredQuery = db.prepare("DELETE FROM data WHERE id = ?")

function deleteExpired(fileCallback){
	findExpiredQuery.each([(new Date()).getTime()],function(err,row){
		if (err)return;
		deleteExpiredQuery.run([row.id])
		if (row.type==1&&fileCallback){
			fileCallback(row.id)
		}
	})
}

module.exports={get,insertText,insertFile,deleteExpired}