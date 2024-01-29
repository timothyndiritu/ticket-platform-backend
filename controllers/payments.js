const Payment = require("../models/payments");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const payments = require("../models/payments");

const getAllPayments = async (req, res) => {
  const payments = await Payment.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ payments, count: payments.length });
};
const getPayment = async (req, res) => {
  const {
    user: { userId },
    params: { id: paymentId },
  } = req;

  const payment = await Payment.findOne({
    _id: paymentId,
    createdBy: userId,
  });

  if (!payment) {
    throw new NotFoundError(`No payment with id ${paymentId}`);
  }

  res.status(StatusCodes.OK).json({ payment });
};
const createPayment = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const payment = await Payment.create(req.body);
  res.status(StatusCodes.CREATED).json({ payment });
};
const updatePayment = async (req, res) => {
  const {
    body:{company,location},
    user: { userId },
    params: { id: paymentId },
  } = req;

  if (company === '' || location === '') {
    throw new BadRequestError('Company or Location fields cannot Be empty')
  }

  const payment = await Payment.findOneAndUpdate({ _id: paymentId, createdBy: userId }, req.body, { new: true, runValidators: true });

  if (!payment) {
    throw new NotFoundError(`No payment with id ${paymentId}`);
  }

  res.status(StatusCodes.OK).json({ payment });
};
const deletePayment = async (req, res) => {
  
  const {
    user: { userId },
    params: { id: paymentId },
  } = req;

  const payment = await Payment.findOneAndRemove({
    _id: paymentId,
    createdBy: userId
  })
  if (!payment) {
    throw new NotFoundError(`No payment with id ${paymentId}`);
  }

  res.status(StatusCodes.OK).send();

};

module.exports = {
  getAllPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
};
