const { Server } = require("socket.io");
const {
  calculateTime,
  cutPeice,
} = require("../controllers/calculateTimeDifference");
const extractTotalMinutes = require("../controllers/calculatePrice");

function initializeSocketServer(port) {
  const io = new Server(port, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New connection made on ${socket.id}`);
    
    
    socket.on("ticketID", async (arg) => {
      const Ticket = require("../models/tickets");
      const { BadRequestError, NotFoundError } = require("../errors");

      const ticketId = arg;

      const ticket = await Ticket.findOne({
        $and: [
          { status: { $ne: "paid" } },
          {
            $or: [{ ticketNumber: ticketId }, { numberPlate: ticketId }],
          },
        ],
      });

      if (!ticket) {
        socket.emit("error", `No ticket of ticket id ${ticketId} `);
        return;
      }
      const difference = calculateTime(ticket.createdAt);
      const price = extractTotalMinutes(difference);

      const duration = cutPeice(difference);
      const ticketData = {
        ticketNumber: ticket.ticketNumber,
        ticketId: ticket._id,
        numberPlate: ticket.numberPlate,
        entryTime: ticket.createdAt,
        duration,
        price: price,
      };
      socket.emit("ticketData", JSON.stringify(ticketData));

      //ticket changes
      const changeStream = Ticket.watch(
        [{ $match: { "fullDocument._id": ticket._id } }],
        { fullDocument: "updateLookup" }
      );
      changeStream.on("change", async (change) => {
        if (
          change.operationType === "update" &&
          change.fullDocument.status === "paid"
        ) {
          
          // Emit an event to the connected Socket.IO client when status changes to 'paid'
          socket.emit("statusChanged", {
            message: "Ticket status changed to paid!",
          });
        }
      });
    });
  });

  return io;
}

module.exports = initializeSocketServer;
