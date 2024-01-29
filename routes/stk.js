const express = require("express");

const router = express.Router();

const {
  access,
  myStkPush,
  generateTimestamp
} = require("../controllers/makeStk");



router.route('/').post(access,myStkPush);


module.exports = router;
