const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

const TaskSubmissionFunctions = require("../controllers/TaskSubmissionFunctions");
const taskSubmissionFunctions = new TaskSubmissionFunctions();

router.post("/entities/:entityId/projects/:projectId/proposals/:proposalId/tasks/:taskId", async function (req, res) {
  try {
    var data = await taskSubmissionFunctions.createNewTaskSubmission(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.post("/entities/:entityId/projects/:projectId/proposals/:proposalId/tasks/:taskId/vote", async function (req, res) {
  try {
    var data = await taskSubmissionFunctions.voteOnTaskSubmission(req);
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
