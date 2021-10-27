const express = require('express');
const router  = express.Router();
const database = require("../db/database");

module.exports = () => {
  router.get("/new", (req, res) => {
    res.render("createEvent");
    console.log("success!");
  });

  router.post("/new", async(req, res) => {
    console.log('inside post')
    function generateUniqueURL() {
      let randomString = ''
      const possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      for (let i = 0; i < 10; i++) {
        randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      }
      console.log('randomFN output', randomString)
      return randomString;
    };
    const uniqueUrl = generateUniqueURL();

    const owner = {
      name: req.body.name,
      email: req.body.email
    }

    const event = {
      title: req.body.title,
      description: req.body.description,
      url: uniqueUrl,
      owner_id: 3
    }

    console.log(req.body);
    console.log(owner, event);

    await database.addUsers(owner);
    await database.addEvent(event);
    res.json({url: `/vote/${uniqueUrl}`})
  })
  return router;
};
