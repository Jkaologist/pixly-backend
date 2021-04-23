const db = require("./db")

async function addToDb(key, link)  {

  const result = await db.query(
    `INSERT INTO pics 
    (id, link)
    VALUES ($1, $2)
    RETURNING id, link`, [key, link])
  
  const info = result.rows[0];

  return info;
}

async function getAllFromDb() {

  const result = await db.query(
    `SELECT id
    FROM pics`)
  
  const info = result.rows;

  return info;
}

module.exports = {addToDb, getAllFromDb}