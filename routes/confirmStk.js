const express = require("express");

const router = express.Router();

const {
 checkResponse
} = require("../controllers/confirmStk");



router.route('/').post(checkResponse);


module.exports = router;
