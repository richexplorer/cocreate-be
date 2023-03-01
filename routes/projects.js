const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

const ProjectFunctions = require("../controllers/ProjectFunctions");
const projectFunctions = new ProjectFunctions();

router.get("/entities/:entityId/projects", async function (req, res) {
  try {
    var data = await projectFunctions.getAllProjectsForEntity(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.get("/entities/:entityId/projects/:projectId", async function (req, res) {
    try {
      var data = await projectFunctions.getProjectDetails(req);
      res.json(data);
    } catch (error) {
      console.log("API Endpoint error");
      console.log(error);
      res.json({ success: false, error: "Error Occured" });
    }
});

router.post("/entities/:entityId/projects", async function (req, res) {
    try {
      var data = await projectFunctions.createOrUpdateProject(req);
      res.json(data);
    } catch (error) {
      console.log("API Endpoint error");
      console.log(error);
      res.json({ success: false, error: "Error Occured" });
    }
});

router.post("/entities/:entityId/projects/:projectId/update", async function (req, res) {
    try {
      var data = await projectFunctions.createOrUpdateProject(req);
      res.json(data);
    } catch (error) {
      console.log("API Endpoint error");
      console.log(error);
      res.json({ success: false, error: "Error Occured" });
    }
});

router.post("/entities/:entityId/projects/:projectId/join", async function (req, res) {
  try {
    var data = await projectFunctions.joinProjectOrUpdateRole(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.post("/entities/:entityId/projects/:projectId/update-role", async function (req, res) {
  try {
    var data = await projectFunctions.joinProjectOrUpdateRole(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.post("/entities/:entityId/projects/:projectId/join/discord", async function (req, res) {
  try {
    var data = await projectFunctions.joinProjectOrUpdateRoleWithDiscordId(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.post("/entities/:entityId/projects/:projectId/update-role/discord", async function (req, res) {
  try {
    var data = await projectFunctions.joinProjectOrUpdateRoleWithDiscordId(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.get("/entities/:entityId/projects/:projectId/users", async function (req, res) {
  try {
    var data = await projectFunctions.getProjectUsers(req);
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
