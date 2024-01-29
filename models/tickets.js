const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
      unique: true,
    },
    numberPlate: {
      type: String,
      required: [true, "Please provide location"],
      maxlength: 100,
    },
    createdFor: {
      type: String,
      // required: [false, "Please provide user"], // this can be changed for payments without id
      default: "anonymous",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: [true, "Please provide company"],
    },
    status: {
      type: String,
      enum: ["paid", "declined", "pending", "not paid"],
      default: "not paid",
    },
    CheckoutRequestID: {
      type: String,
      default: "new card",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tickets", TicketSchema);
