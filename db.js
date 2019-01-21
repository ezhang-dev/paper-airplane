var randomNumber = require("random-number-csprng");

var db={}

async function get(id){
  return db[id]
}

async function add(data){
  let id = await randomNumber(1, 9999);
  if (db[id]) return add(data)
  data.id=id
  db[id]=data
  console.log("Store",id,data)
  return id
}

module.exports={get,add}