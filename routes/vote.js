const express = require('express');
const router  = express.Router();

module.exports = () => {
  router.get("/vote", (req, res) => { // /:uniqueUrl
    res.render("votePoll");
    console.log("success!");
  });
  return router;
};
