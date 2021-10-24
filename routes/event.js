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
      description: req.body.event_description,
      url: generateUniqueURL()
    }

    function generateUniqueURL() {
      let randomString = ""
      const possibleChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      for (let i = 0; i < 10; i++) {
        randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      }
      return randomString;
    };

  })
  return router;
};
