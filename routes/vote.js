const express = require('express');
const router = express.Router();
const database = require("../db/database");


module.exports = () => {
  router.get("/:uniqueUrl", (req, res) => {
    let uniqueUrl = req.params.uniqueUrl;

    // cookie session - check
    // if exist give access
    // otherwise alternative render

    database.getEventByUrl(uniqueUrl)
      .then(event => {
        // console.log('vote.js', event)
        res.render("votePoll", { event })
        console.log("success!");
      })
  });

  router.post("/:uniqueUrl", (req, res) => {
    // grab name and email req.body

    // without ajax will be roload

    const voter = { // Information available, click 'Get Poll Button'
      voterName: req.body.voterName,
      voterEmail: req.body.voterEmail
    }

    const votes = {
      optionOne: req.body.optionOneVote,
      optionTwo: req.body.optionTwoVote,
      optionThree: req.body.optionThreeVote
    }


    let uniqueUrl = req.body.url
    // insert users table :: returning




    // insert into votes table
    res.json({ url: `/vote/${uniqueUrl}` })
  })
  return router;
};
