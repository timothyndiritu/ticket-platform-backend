const Ticket = require("../models/tickets");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const tickets = require("../models/tickets");

const getAllTickets = async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  console.log(req.user.userId);
  res.status(StatusCodes.OK).json({ tickets, count: tickets.length });
};
const getTicket = async (req, res) => {
  const {
    // user: { userId },
    params: { id: ticketId },
  } = req;

  const ticket = await Ticket.findOne(
    // {
    //   //numberPlate
    // // _id: ticketId,
    // ticketNumber: ticketId,
    // // createdBy: userId,
    // }
    {
      $and: [
        // { status: { $ne: "paid" } },
        {
          $or: [
            { ticketNumber: ticketId },
            { numberPlate: ticketId },
            // { CheckoutRequestID: ticketId },
          ],
        },
      ],
    }
  );

  if (!ticket) {
    throw new NotFoundError(`No ticket with id ${ticketId}`);
  }

  res.status(StatusCodes.OK).json({
    ticket,
    // ticketNumber: ticket.ticketNumber,
    // numberPlate: ticket.numberPlate,
    // entryTime: ticket.createdAt,
  });
};
const createTicket = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const ticket = await Ticket.create(req.body);
  res.status(StatusCodes.CREATED).json({ ticket });
};
const updateTicket = async (req, res) => {
  const {
    body: { status, createdFor, CheckoutRequestID },
    params: { id: ticketId },
  } = req;

  if (status === "" || createdFor === "") {
    throw new BadRequestError("Company or Location fields cannot Be empty");
  }

  const ticket = await Ticket.findOneAndUpdate(
    {
      $and: [
        { status: { $ne: "paid" } },
        {
          $or: [
            { ticketNumber: ticketId },
            { numberPlate: ticketId },
            { CheckoutRequestID: ticketId },
          ],
        },
      ],
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!ticket) {
    throw new NotFoundError(`No payment with id ${ticketId}`);
  }

  res.status(StatusCodes.OK).json({ ticket });
};
const deleteTicket = async (req, res) => {
  const {
    user: { userId },
    params: { id: ticketId },
  } = req;

  const ticket = await Ticket.findOneAndRemove({
    _id: ticketId,
    createdBy: userId,
  });
  if (!ticket) {
    throw new NotFoundError(`No payment with id ${ticketId}`);
  }

  res
    .status(StatusCodes.OK)
    .send(`ticket with id${ticketId} deleted successfully`);
};

module.exports = {
  getAllTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
};
