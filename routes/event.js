const express = require('express');
const router  = express.Router();
const database = require("../db/database");

module.exports = () => {
  router.get("/new", (req, res) => {
    res.render("createEvent");
    console.log("success!");
  });

  router.post("/new", (req, res) => {
    const uniqueURL = generateUniqueURL();

    const owner = {
      name: req.body.owner_name,
      email: req.body.owner_email
    }

    const event = {
      title: req.body.event_title,
      description: req.body.event_description,
      url: uniqueURL
    }

    function generateUniqueURL() {
      let randomString = ""
      const possibleChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      for (let i = 0; i < 10; i++) {
        randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      }
      return randomString;
    };

    database.addUsers(owner);
    database.addEvent(event);
    res.redirect(`/vote/${url}`)
  })
  return router;
};
