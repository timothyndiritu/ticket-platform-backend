const request = require("request");
require("dotenv").config();
const { calculateTime } = require("./calculateTimeDifference");
const extractTotalMinutes = require("../controllers/calculatePrice");
//ticket
const Ticket = require("../models/tickets");
const updateTicket = require("../controllers/updateTicket");
//errors
const { NotFoundError } = require("../errors");

//access token
function access(req, res, next) {
  let url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  let auth = new Buffer.from(process.env.AUTH_PASS).toString("base64");

  try {
    request(
      {
        url,
        headers: {
          Authorization: "Basic " + auth,
        },
      },
      (error, response, body) => {
        if (error) {
          console.log(error);
        } else {
          req.access_token = JSON.parse(body).access_token;

          next();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}

//time stamp
function generateTimestamp() {
  const date = new Date();

  const year = date.getFullYear().toString();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

async function myStkPush(req, res, next) {
  const phoneNumber = req.body.PhoneNumber;
  const ticketNumber = req.body.TicketNumber;
  const ticketID = req.body.TicketID;

  const price = await setPrice(ticketNumber);

  let url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  let auth = "Bearer " + req.access_token;

  const timeStamp = generateTimestamp();

  const password = Buffer.from(
    "174379" +
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
      timeStamp
  ).toString("base64");
  //'BS + PK + TS';
  request(
    {
      url,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        BusinessShortCode: 174379,
        Password: password,
        Timestamp: timeStamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: price,
        PartyA: 254708374149,
        PartyB: 174379,
        PhoneNumber: phoneNumber,
        CallBackURL: process.env.HOST_WEB + "/confirmStk",
        AccountReference: `KAPS LTD Ticket number ${ticketNumber}`,
        TransactionDesc: `Payment of Ticket number ${ticketNumber}`,
      },
    },
    async function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        const MerchantRequestID = body.MerchantRequestID;

        let data = {
          CheckoutRequestID: MerchantRequestID,
        };
        //set checkout id
        try {
          await updateTicket(ticketNumber, data);
        } catch (error) {
          console.log(error);
          return;
        }

        res.status(200).json("Please enter the pin on your phone");
      }
    }
  );
}

async function setPrice(ticketId) {
  const ticket = await Ticket.findOne({
    $and: [
      { status: { $ne: "paid" } },
      {
        $or: [{ ticketNumber: ticketId }, { numberPlate: ticketId }],
      },
    ],
  });

  if (!ticket) {
    throw new NotFoundError(`No ticket with id ${ticketId}`);
  }

  const difference = calculateTime(ticket.createdAt);

  return extractTotalMinutes(difference);
}

module.exports = {
  access,
  myStkPush,
  generateTimestamp,
};
