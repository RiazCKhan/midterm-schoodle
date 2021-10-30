const express = require("express");
const router = express.Router();
const database = require("../db/database");

module.exports = () => {
  router.get("/:uniqueUrl", (req, res) => {
    let uniqueUrl = req.params.uniqueUrl;
    const email = req.session.email;
    const name = req.session.name;
    console.log("cookies 123", email, name);

    database.getEventByUrl(uniqueUrl).then((event) => {
      // Take JS from votePoll.ejs AND set EJS variables HERE - THEN pass all across like event, name, email
      console.log("vote.js", event);
      res.render("votePoll", { event, name, email });
      console.log("success!");
    });
  });

  router.post("/:uniqueUrl", async (req, res) => {
    const voterInfo = {
      name: req.body.voterName,
      email: req.body.voterEmail,
    };

    req.session.email = voterInfo.email;
    req.session.name = voterInfo.name;

    console.log("VOTEJS voter", voterInfo);

    let timeId = [];
    let selection = [];

    timeId.push(req.body.optionOneVote.split(",")[0]);
    timeId.push(req.body.optionTwoVote.split(",")[0]);
    timeId.push(req.body.optionThreeVote.split(",")[0]);

    selection.push(req.body.optionOneVote.split(",")[1]);
    selection.push(req.body.optionTwoVote.split(",")[1]);
    selection.push(req.body.optionThreeVote.split(",")[1]);

    const votes = {
      timeId,
      selection,
    };

    console.log("timeId: ", timeId);
    console.log("selection: ", selection);

    let uniqueUrl = req.body.url;

    // console.log('what am i', database.getVotesFromEmail(voterInfo))

    const ifVotes = await database.getVotesFromEmail(voterInfo);
    console.log('$$$$', ifVotes)

    if (ifVotes && ifVotes.length) {
      await database.updateVotes(votes, voterInfo)
    } else {
      await database.addVotes(votes, voterInfo);
    }

    // await database.addVotes(votes, voterInfo);
    res.json({ url: `/vote/${uniqueUrl}` });
  });
  return router;
};
