const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

const EntityFunctions = require("../controllers/entityFunctions");
const entityFunctions = new EntityFunctions();

router.get("/entities", async function (req, res) {
  try {
    var data = await entityFunctions.getAllEntities(req);
    res.json(data);
  } catch (error) {
    console.log("API Endpoint error");
    console.log(error);
    res.json({ success: false, error: "Error Occured" });
  }
});

router.get("/entities/:entityId", async function (req, res) {
    try {
      var data = await entityFunctions.getEntityDetails(req);
      res.json(data);
    } catch (error) {
      console.log("API Endpoint error");
      console.log(error);
      res.json({ success: false, error: "Error Occured" });
    }
});

router.post("/entities", async function (req, res) {
    try {
      var data = await entityFunctions.createOrUpdateEntity(req);
      res.json(data);
    } catch (error) {
      console.log("API Endpoint error");
      console.log(error);
      res.json({ success: false, error: "Error Occured" });
    }
});

router.post("/entities/:entityId/update", async function (req, res) {
    try {
      var data = await entityFunctions.createOrUpdateEntity(req);
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
