const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);
db.connect();

const addUsers = (user) => {
  return db
  .query(`INSERT into users (name, email)
    VALUES ($1, $2, $3)
    RETURNING *;`
    , [user.name, user.email])
  .then((result) => {
    result.rows[0];
  })
  .catch((err) => {
    console.log(err.stack);
  });
}
exports.addUsers = addUsers;

const addEvent = (event) => {

}
