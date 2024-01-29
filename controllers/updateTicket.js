const Ticket = require("../models/tickets");

async function updateTicket(ticketId, updateJSON) {
 try {
  const update = await Ticket.findOneAndUpdate(
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
    updateJSON,
    { new: true, runValidators: true }
   );
   
 } catch (error) {
  console.log(error);
 }
  
  
}

module.exports = updateTicket;
