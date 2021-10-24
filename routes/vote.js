const express = require('express');
const router  = express.Router();

module.exports = () => {
  router.get("/uniqueid", (req, res) => {
    res.render("votePoll");
    console.log("success!");
  });
  return router;
};
