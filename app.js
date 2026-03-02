const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cabinRouter = require("./routes/cabinRouter.js");
const guestRouter = require("./routes/guestRouter.js");
const settingsRouter = require("./routes/settingsRouter.js");
const bookingsRouter = require("./routes/bookingsRouter.js");
const userRouter = require("./routes/userRouter.js");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

app.use("/api/v1/cabins", cabinRouter);
app.use("/api/v1/guests", guestRouter);
app.use("/api/v1/settings", settingsRouter);
app.use("/api/v1/bookings", bookingsRouter);
app.use("/api/v1/auth", userRouter);

app.use((err, req, res, next) => {
  console.error("STACK TRACE:");
  console.error(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
