const express = require('express');
const router  = express.Router();
const database = require("../db/database");


module.exports = () => {
  router.get("/:uniqueUrl", (req, res) => {
    let uniqueUrl = req.params.uniqueUrl;

    database.getEventByUrl(uniqueUrl)
    .then(event => {
      console.log('vote.js', event)
      res.render("votePoll", {event})
      console.log("success!");
    })
  });


  router.post("/uniqueid", (req, res) => {




  })
  return router;
};
