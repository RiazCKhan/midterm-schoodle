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
  return db
  .query(`INSERT INTO events (title, description, url)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [event.title, event.description, event.url])
  .then((result) => {
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
  [vote.selection]) // Will need to match names of info taken in on votes page
  .then((result) => {
    result.rows[0];
  })
  .catch((err) => {
    console.log(err.stack);
  });
}
exports.addVotes = addVotes;


const addTimes = function (times) {
  console.log('all times', times)
  return db
  .query(`INSERT INTO times (start_date, end_date)
  VALUES ($1, $2)
  RETURNING *;`,
  [times.startDates, times.endDates]) // Will need to match names of info taken in on votes page
  .then((result) => {
    console.log('result', result.rows)
    result.rows;
  })
  .catch((err) => {
    console.log(err.stack);
  });
}
exports.addTimes = addTimes;

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


const getEventByUrl = function(url) {
  return db
  .query(`SELECT events.url, times.id, times.start_date, times.end_date
    FROM events
    LEFT OUTER JOIN times ON events.id = event_id
    JOIN users ON users.id = owner_id
    WHERE events.url = $1
    `, [url])
  .then((result) => {
    if (result) {
      console.log('result.rows in database.js', result.rows)
      return result.rows;
    } else {
      return null;
    }
  })
  .catch((err) => {
    console.log(err.stack);
  });
}
exports.getEventByUrl = getEventByUrl


