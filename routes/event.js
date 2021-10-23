const express = require('express');
const router  = express.Router();

module.exports = () => {
  router.get("/new", (req, res) => {
    res.render("createEvent");
    console.log("success!");
  });
  return router;
};
