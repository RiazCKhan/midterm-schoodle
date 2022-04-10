const express = require("express");
const router = express.Router();
const database = require("../db/database");

module.exports = () => {
  router.get("/new", (req, res) => {
    res.render("createEvent");
    console.log("success!");
  });

  router.post("/new", async (req, res) => {
    function generateUniqueURL() {
      let randomString = "";
      const possibleChars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      for (let i = 0; i < 10; i++) {
        randomString += possibleChars.charAt(
          Math.floor(Math.random() * possibleChars.length)
        );
      }
      return randomString;
    }
    const uniqueUrl = generateUniqueURL();

    const owner = {
      name: req.body.name,
      email: req.body.email,
    };

    const event = {
      title: req.body.title,
      description: req.body.description,
      url: uniqueUrl,
    };

    const times = {
      startDates: req.body.startDates,
      endDates: req.body.endDates,
    };

    req.session.email = owner.email;
    req.session.name = owner.name;

    await database.addUsers(owner);
    await database.addEvent(event);
    await database.addTimes(times, event);
    res.json({ url: `/vote/${uniqueUrl}` });
  });
  return router;
};
