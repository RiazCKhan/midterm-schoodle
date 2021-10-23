const express = require('express');
const router  = express.Router();

module.exports = () => {
  router.get("/:uniqueUrl", (req, res) => {
    res.render("index");
    console.log("success!");
  });
  return router;
};
