const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    location: {
      type: String,
      required: [true, "Please provide location"],
      maxlength: 100,
    },
    duration: {
      type: String,
      required: [true, "Please provide location"],
      maxlength: 100,
    },
    amount: {
      type: String,
      required: [true, "Please provide ammount"],
      maxlength: 1000,
    },
    receiptNumber: {
      type: String,
      required: [true, "Please provide ammount"],
    },
    createdBy: {
      type: String,
      required: [true, "Please provide creator"],
      maxlength: 100,
    },
    ticketNumber: {
      type: String,
      required: [true, "Please provide creator"],
      maxlength: 100,
    },
    ticketId: {
      type: String,
      required: [true, "Please provide creator"],
      maxlength: 100,
    },
    numberPlate: {
      type: String,
      required: [true, "Please provide creator"],
      maxlength: 100,
    },
    dateOfCreation: {
      type: String,
      required: [true, "Please provide creator"],
      maxlength: 100,
    },
    TransactionDate: {
      type: String,
      required: [true, "Please provide creator"],
      maxlength: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payments", PaymentSchema);
