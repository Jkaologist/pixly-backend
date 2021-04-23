const db = require("./db")

async function addToDb(key, link)  {
  console.log("key!!", key)
  console.log("info!!", link)
  db.query('SELECT * FROM pg_catalog.pg_tables', function(err, result) {
    console.log(result);
  });
  const result = await db.query(
    `INSERT INTO pixly 
    (key, link)
    VALUES ($1, $2)
    RETURNING key, link`, [key, link])
  
  const info = result.rows[0];


  return info;
  }

module.exports = {addToDb}