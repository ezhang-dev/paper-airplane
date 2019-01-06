var randomNumber = require("random-number-csprng");

var db={}

async function get(id){
  return db[id]
}

async function add(data){
  let id = await randomNumber(1, 9999);
  db[id]=data
  console.log("Store",id,data)
  return id
}

module.exports={get,add}
add({a:1}).then(q=>console.log(q,db))
