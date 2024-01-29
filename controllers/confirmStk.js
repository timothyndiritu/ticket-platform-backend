const { StatusCodes } = require("http-status-codes");
const Payment = require("../models/payments");
const axios = require("axios");
require("dotenv").config();
const Ticket = require("../models/tickets");
const { BadRequestError, NotFoundError } = require("../errors");
const updateTicket = require("../controllers/updateTicket");
const {
  calculateTime,
  cutPeice,
} = require("../controllers/calculateTimeDifference");

async function checkResponse(req, res, next) {
  try {
    console.log(req.body);
    const resultCode = req.body.Body.stkCallback.ResultCode;
    console.log(resultCode);
    const { MerchantRequestID } = req.body.Body.stkCallback;

    if (resultCode == 0) {
      console.log("result code is 0");
      let darajaData = req.body.Body.stkCallback.CallbackMetadata.Item;
      console.log(darajaData);

      try {
        await updateStatus();
        await createPayment(MerchantRequestID);
        return;
      } catch (error) {
        console.log(error);
        return;
      }

      async function updateStatus() {
        const data = {
          status: "paid",
        };
        await updateTicket(MerchantRequestID, data);
      }

      async function createPayment(MerchantRequestID) {
        //find ticket
        const ticket = await Ticket.findOne({
          $and: [
            // { status: { $ne: "paid" } },
            { CheckoutRequestID: MerchantRequestID },
          ],
        });

        if (!ticket) {
          throw new NotFoundError(`No ticket with id ${MerchantRequestID}`);
        }
        console.log(ticket);
        let Amount,
          MpesaReceiptNumber,
          Balance,
          TransactionDate,
          PhoneNumber,
          company,
          location;

          darajaData.forEach((item) => {
          switch (item.Name) {
            case "Amount":
              Amount = item.Value;
              break;
            case "MpesaReceiptNumber":
              MpesaReceiptNumber = item.Value;
              break;
            case "Balance":
              Balance = item.Value || null; // Assuming it might be missing, setting to null if absent
              break;
            case "TransactionDate":
              TransactionDate = item.Value;
              break;
            case "PhoneNumber":
              PhoneNumber = item.Value;
              break;
            default:
              break;
          }
          });
        
        //set company and location
        company = 'KAPS';
        location = 'KAPS';

        //calculate time and duration
        const difference = calculateTime(ticket.createdAt);
        const duration = cutPeice(difference);

        const paymentData = {
          company,
          location,
          amount: Amount,
          duration,
          TransactionDate,
          receiptNumber: MpesaReceiptNumber,
          createdBy: PhoneNumber,
          ticketNumber: ticket.ticketNumber,
          ticketId: ticket._id,
          numberPlate: ticket.numberPlate,
          dateOfCreation: ticket.createdAt,
        };

        await Payment.create(paymentData);
      }
    } else {
      console.log("result code is not 0");
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  checkResponse,
};
