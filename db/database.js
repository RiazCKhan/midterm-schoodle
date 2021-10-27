const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);
db.connect();


const addUsers = (user) => {
  return db
  .query(`INSERT INTO users (name, email)
    VALUES ($1, $2)
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
  console.log('Im event pre query', event)
  return db
  .query(`INSERT INTO events (title, description, url)
    VALUES ($1, $2, $3)
    RETURNING owner_id;`, // From RETURNING *; --> RETURNING owner_id - Manage this error msg - error: insert or update on table "events" violates foreign key constraint "events_owner_id_fkey"
    [event.title, event.description, event.uniqueURL])
  .then((result) => {
    console.log('Im db', result.rows[0])
    result.rows[0];
  })
  .catch((err) => {
    console.log(err.stack);
  });
}
exports.addEvent = addEvent;


const addVotes = (votes) => {
  return db
  .query(`INSERT INTO votes (voter_id, time_id, vote)
  VALUES ($3)
  RETURNING *;`,
  [vote.selection]) //will need to match names of info taken in on votes page
  .then((result) => {
    result.rows[0];
  })
  .catch((err) => {
    console.log(err.stack);
  });
}
exports.addVotes = addVotes;


const getUserWithEmail = function(user) {
  return db
  .query(`SELECT users.*
    FROM users
    WHERE email = $1`
    , [user.email])
    .then((result) => {
      if (result) {
        return result.rows[0];
      } else {
        addUsers(user);
      }
    })
    .catch((err) => {
      console.log(err.stack);
    })
}
exports.getUserWithEmail = getUserWithEmail;


const getVotesFromEmail = function(email) {
  return db
  .query(`SELECT votes.*
    FROM votes
    JOIN users ON users.id = voter_id
    WHERE email = $1`
    , [email])
  .then((result) => {
    if (result) {
      return result.rows;
    } else {
      return null;
    }
  })
  .catch((err) => {
    console.log(err.stack);
  });
}
exports.getVotesFromEmail = getVotesFromEmail;


const getEventById = function(id) {
  return db
  .query(`SELECT *
    FROM events
    JOIN times ON events.id = event_id
    JOIN users ON users.id = owner_id
    WHERE events.id = $1
    `, [id])
  .then((result) => {
    if (result) {
      console.log('Iam the database query', result.rows)
      return result.rows;
    } else {
      return null;
    }
  })
  .catch((err) => {
    console.log(err.stack);
  });
}
exports.getEventById = getEventById
