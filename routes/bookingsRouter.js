const bookingController = require("../controller/bookingController");
const authController = require("../controller/authController");
const express = require("express");

const router = express.Router();

router
  .route("/")
  .post(bookingController.createBooking)
  .get(bookingController.getBookings);

router
  .route("/:id")
  .get(bookingController.getBookingById)
  .patch(authController.protect, bookingController.updateBooking)
  .delete(authController.protect, bookingController.deleteBooking);

module.exports = router;
