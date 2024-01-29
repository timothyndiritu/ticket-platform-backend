const express = require("express");

const authenticateUser = require("../middleware/companyAuth");

const router = express.Router();

const {
  getAllTickets,
  getTicket,
  createTicket,
  deleteTicket,
} = require("../controllers/tickets");

router
  .route("/")
  .post(authenticateUser, createTicket)
  .get(authenticateUser, getAllTickets);
router.route("/:id").get(getTicket).delete(authenticateUser, deleteTicket);

module.exports = router;
