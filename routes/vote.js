const express = require("express");
const router = express.Router();
const database = require("../db/database");

module.exports = () => {
  router.get("/:uniqueUrl", async (req, res) => {
    let uniqueUrl = req.params.uniqueUrl;
    const email = req.session.email;
    const name = req.session.name;

    const formattedEvent = { times: {} };

    const times = await database.getTimeIdsByUrl(uniqueUrl);
    times.forEach((time) => {
      formattedEvent.times[time.id] = {
        votes: [],
        startDate: time.start_date,
        endDate: time.end_date,
      };
    });

    const votes = await database.getVotesByUniqueUrl(uniqueUrl);

    votes.forEach((vote) => {
      if (!formattedEvent.title) {
        formattedEvent.title = vote.title;
        formattedEvent.description = vote.description;
      }
      if (!formattedEvent.times[vote.time_id]) {
        formattedEvent.times[vote.time_id] = {
          votes: [],
          startDate: vote.start_date,
          endDate: vote.end_date,
        };
      }
      formattedEvent.times[vote.time_id].votes.push(vote);
    });

    database.getEventByUrl(uniqueUrl).then((event) => {
      // Take JS from votePoll.ejs AND set EJS variables HERE - THEN pass all across like event, name, email
      res.render("votePoll", { event, name, email, formattedEvent });
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

    let uniqueUrl = req.body.url;

    const ifVotes = await database.getVotesFromEmail(voterInfo);

    if (ifVotes && ifVotes.length) {
      await database.updateVotes(votes, voterInfo);
    } else {
      await database.addVotes(votes, voterInfo);
    }

    res.json({ url: `/vote/${uniqueUrl}` });
  });
  return router;
};
