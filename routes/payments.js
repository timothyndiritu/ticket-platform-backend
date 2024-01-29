const express = require('express');
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const { getAllPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment, } = require('../controllers/payments');

router.route('/').post(createPayment).get(authenticateUser,getAllPayments);
router.route('/:id').get(authenticateUser,getPayment).delete(authenticateUser,deletePayment).patch(authenticateUser,updatePayment);

module.exports = router