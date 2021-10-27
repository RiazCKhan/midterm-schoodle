const express = require('express');
const router  = express.Router();

module.exports = () => {
  router.get("/:uniqueUrl", (req, res) => {
    let uniqueUrl = req.params.uniqueUrl;

    res.render("votePoll");
    console.log("success!");
  });

  router.post("/uniqueid", (req, res) => {


  })
  return router;
};
