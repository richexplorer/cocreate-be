const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

const ProposalFunctions = require("../controllers/ProposalFunctions");
const proposalFunctions = new ProposalFunctions();

router.get("/entities/:entityId/projects/:projectId/proposals", async function (req, res) {
  try {
    var data = await proposalFunctions.getAllProposalsForProject(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.get("/entities/:entityId/projects/:projectId/proposals/:proposalId", async function (req, res) {
    try {
      var data = await proposalFunctions.getProposalDetailsForProject(req);
      res.json(data);
    } catch (error) {
      console.log("API Endpoint error");
      console.log(error);
      res.json({ success: false, error: "Error Occured" });
    }
});

router.post("/entities/:entityId/projects/:projectId/proposals", async function (req, res) {
    try {
      var data = await proposalFunctions.createOrUpdateProposal(req);
      res.json(data);
    } catch (error) {
      console.log("API Endpoint error");
      console.log(error);
      res.json({ success: false, error: "Error Occured" });
    }
});

router.post("/entities/:entityId/projects/:projectId/proposals/:proposalId/update", async function (req, res) {
    try {
      var data = await proposalFunctions.createOrUpdateProposal(req);
      res.json(data);
    } catch (error) {
      console.log("API Endpoint error");
      console.log(error);
      res.json({ success: false, error: "Error Occured" });
    }
});

router.post("/entities/:entityId/projects/:projectId/proposals/:proposalId/vote", async function (req, res) {
  try {
    var data = await proposalFunctions.voteOnProposalOnDiscord(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.get("/entities/:entityId/projects/:projectId/proposals/:proposalId/votes", async function (req, res) {
  try {
    var data = await proposalFunctions.getProposalVotes(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.post("/entities/:entityId/projects/:projectId/proposals/:proposalId/execute", async function (req, res) {
  try {
    var data = await proposalFunctions.executeProposal(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.get("/entities/:entityId/projects/:projectId/proposals/:proposalId/tasks", async function (req, res) {
  try {
    var data = await proposalFunctions.getProposalTasks(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.post("/entities/:entityId/projects/:projectId/proposals/:proposalId/tasks", async function (req, res) {
  try {
    var data = await proposalFunctions.createNewTaskForProposal(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});


// router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
//   res.json({ user: req.user });
// })

module.exports = router;
