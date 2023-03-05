const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

const UserFunctions = require("../controllers/UserFunctions");
const userFunctions = new UserFunctions();

router.get("/entities/:entityId/users", async function (req, res) {
  try {
    var data = await userFunctions.getAllRegisteredUsers(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.get("/entities/:entityId/users/discord/:discordId", async function (req, res) {
  try {
    var data = await userFunctions.getUserForDiscordId(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.post("/entities/:entityId/users", async function (req, res) {
  try {
    var data = await userFunctions.addOrUpdateUserForEntity(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.post("/entities/:entityId/users/:userId/update", async function (req, res) {
    try {
      var data = await userFunctions.addOrUpdateUserForEntity(req);
      res.json(data);
    } catch (error) {
      console.log("API Endpoint error");
      console.log(error);
      res.json({ success: false, error: "Error Occured" });
    }
});

router.post("/entities/:entityId/users/:userId/connect-wallet", async function (req, res) {
    try {
      var data = await userFunctions.addEthWalletForUser(req);
      res.json(data);
    } catch (error) {
      console.log("API Endpoint error");
      console.log(error);
      res.json({ success: false, error: "Error Occured" });
    }
});

router.post("/entities/:entityId/users/connect-discord-and-wallet", async function (req, res) {
  try {
    var data = await userFunctions.connectDiscordAndEthWallet(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});


module.exports = router;
