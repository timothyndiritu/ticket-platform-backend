require("dotenv").config();
const bodyParser = require("body-parser");
require("express-async-errors");
const express = require("express");
const app = express();

//security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// connectDB
const connectDB = require("./db/connect");
//websocket
const initializeSocketServer = require("./db/webSocket");
//authentication
// const authenticateUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");
const companyAuthRouter = require("./routes/companyAuth");
const paymentsRouter = require("./routes/payments");
const ticketsRouter = require("./routes/tickets");
const stkRouter = require("./routes/stk");
const confirmStk = require("./routes/confirmStk");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// extra packages
// app.set('trust proxy',1)
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//   })
// );
app.use(bodyParser.json());
// app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

// app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/companyAuth", companyAuthRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/tickets", ticketsRouter);
app.use("/api/v1/stk", stkRouter);
app.use("/api/v1/confirmStk", confirmStk);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await initializeSocketServer(3024);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
