const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);
db.connect();

const addUsers = (user) => {
  return db
    .query(
      `INSERT INTO users (name, email)
    VALUES ($1, $2)
    RETURNING *;`,
      [user.name, user.email]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log('DB addUsers error', err.stack);
    });
};
exports.addUsers = addUsers;

const addEvent = (event) => {
  return db
    .query(
      `INSERT INTO events (title, description, url)
    VALUES ($1, $2, $3)
    RETURNING *;`,
      [event.title, event.description, event.url]
    )
    .then((result) => {
      result.rows[0];
    })
    .catch((err) => {
      console.log('DB addEvent error', err.stack);
    });
};
exports.addEvent = addEvent;

const addVotes = (votes, voter) => {
  let voterId = 0;

  getUserWithEmail(voter).then(function (result) {
    let parsed = JSON.parse(JSON.stringify(result));
    voterId = parsed[0].id;

    for (let i = 0; i < votes.timeId.length; i++) {
      db.query(
        `INSERT INTO votes (voter_id, time_id, vote)
      VALUES ($1, $2, $3)
      RETURNING *;`,
        [voterId, votes.timeId[i], votes.selection[i]]
      )
        .then((result) => {
          result.rows;
        })
        .catch((err) => {
          console.log('DB addVotes error', err.stack);
        });
    }
  });
};
exports.addVotes = addVotes;

const addTimes = function (times, event) {
  let currentEvent = getEventByUrl(event.url);
  let eventId = 0;

  console.log('addTimes time', times)
  console.log('addTimes event', event)

  currentEvent.then(function (result) {
    let parsed = JSON.parse(JSON.stringify(result));
    eventId = parsed[0].event_id;
    // console.log('id is ', eventId);


    // console.log('current event', currentEvent);
    for (let i = 0; i < times.startDates.length; i++) {
      // console.log('length of array:', times.startDates.length);

      db.query(
        `INSERT INTO times (event_id, start_date, end_date)
      VALUES ($1, $2, $3)
      RETURNING *;`,
        [eventId, times.startDates[i], times.endDates[i]]
      ) // Will need to match names of info taken in on votes page
        .then((res) => {
          // console.log('result', res.rows)
          result.rows;
        })
        .catch((err) => {
          console.log(err.stack);
        });
    }
  });
};
exports.addTimes = addTimes;

const checkVoterWithEmail = function (user) {
  return db
    .query(
      `SELECT users.*
    FROM users
    WHERE email = $1`,
      [user.email]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.stack);
    });
};
exports.checkVoterWithEmail = checkVoterWithEmail;

const getUserWithEmail = function (user) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT users.*
    FROM users
    WHERE email = $1`,
      [user.email]
    )
      .then((result) => {
        if (result.rows.length === 0) {
          console.log("add user");
          return addUsers(user).then((user) => {
            resolve([user]);
          });
        } else {
          console.log("getuser", result.rows[0]);
          resolve(result.rows);
          return result.rows;
        }
      })
      .catch((err) => {
        console.log(err.stack);
        reject(err.stack);
      });
  });
};
exports.getUserWithEmail = getUserWithEmail;

const getVotesFromEmail = function (voter) {
  return db
    .query(
      `SELECT votes.*
    FROM votes
    JOIN users ON users.id = voter_id
    WHERE email = $1`,
      [voter.email]
    )
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
};
exports.getVotesFromEmail = getVotesFromEmail;

const getEventByUrl = function (url) {
  let queryText = `
  SELECT users.id AS user_id, users.id AS owner_id,
    users.name AS name, users.email AS email,
    events.id AS event_id, events.title AS title, events.description AS description, events.url AS unique_url,
    times.id AS time_id, times.start_date AS start_date, times.end_date AS end_date
      FROM events
        FULL OUTER JOIN times ON events.id = event_id
        JOIN users ON users.id = owner_id
        WHERE events.url = $1`;

  return db
    .query(queryText, [url])
    .then((result) => {
      if (result) {
        // console.log('I am database', result.rows)
        return result.rows;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.stack);
    });
};
exports.getEventByUrl = getEventByUrl;

const updateVotes = function (votes, voter) {
  let voterId = 0;

  getUserWithEmail(voter).then(function (result) {
    console.log("result updatedates vote fn", result);
    let parsed = JSON.parse(JSON.stringify(result));
    voterId = parsed[0].id;

    for (let i = 0; i < votes.timeId.length; i++) {
      db.query(
        `UPDATE votes
        SET vote = $1
        WHERE voter_id = $2
        AND time_id = $3`,
        [votes.selection[i], voterId, votes.timeId[i]]
      ) // Will need to match names of info taken in on votes page
        .then((result) => {
          result.rows;
        })
        .catch((err) => {
          console.log(err.stack);
        });
    }
  });
};
exports.updateVotes = updateVotes;

const countYesVotes = function (uniqueUrl, timeId) {
  console.log("count yes function", uniqueUrl, timeId);
  for (let i = 0; i < timeId.length; i++) {
    console.log("loop length", timeId.length);
    console.log("timeID inside loop", timeId[i]);

    return db
      .query(
        `
      SELECT count(votes.*)
      FROM events
      JOIN times ON events.id = event_id
      JOIN votes ON times.id = time_id
      WHERE votes.vote = 't'
      AND events.url = $1
      AND time_id = $2`,
        [uniqueUrl, timeId[i]]
      )
      .finally((result) => {
        console.log("count yes result", result);
        return result;
      })
      .catch((err) => {
        console.log(err.stack);
      });
  }
};
exports.countYesVotes = countYesVotes;

const getVotesByUniqueUrl = function (uniqueUrl) {
  return db
    .query(
      `SELECT *
    FROM events
    JOIN times ON events.id = event_id
    JOIN votes ON times.id = time_id
    WHERE events.url = $1`,
      [uniqueUrl]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.stack);
    });
};
exports.getVotesByUniqueUrl = getVotesByUniqueUrl;

const countNoVotes = function (uniqueUrl, timeId) {
  for (let i = 0; i < timeId.length; i++) {
    db.query(
      `
      SELECT count(votes.*)
      FROM events
      JOIN times ON events.id = event_id
      JOIN votes ON times.id = time_id
      WHERE votes.vote = 'f'
      AND events.url = $1
      AND time_id = $2`,
      [uniqueUrl, timeId[i]]
    )
      .then((result) => {
        result.rows;
      })
      .catch((err) => {
        console.log(err.stack);
      });
  }
};
exports.countNoVotes = countNoVotes;

const getTimeIdsByUrl = function (uniqueUrl) {
  return db
    .query(
      `
    SELECT (times.*)
    FROM times
    JOIN events ON events.id = event_id
    WHERE events.url = $1`,
      [uniqueUrl]
    )
    .then((result) => {
      console.log('result of get time id by url', result.rows)
      return result.rows;
    })
    .catch((err) => {
      console.log(err.stack);
    });
};
exports.getTimeIdsByUrl = getTimeIdsByUrl;
