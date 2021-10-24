const express = require('express');
const router  = express.Router();
const database = require("../db/database");

module.exports = () => {
  router.get("/new", (req, res) => {
    res.render("createEvent");
    console.log("success!");
  });

  router.post("/new", (req, res) => {
    const owner = {
      name: req.body.owner_name,
      email: req.body.owner_email
    }

    const eventDetails = {
      title: req.body.event_title,
      description: req.body.event_description
      url: //need the unique url
    }

  })
  return router;
};
