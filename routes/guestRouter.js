const express = require("express");
const guestController = require("../controller/guestController.js");
const bookingController = require("../controller/bookingController.js");

const router = express.Router();

router.route("/signin").post(guestController.signIn);

router.route("/").get(guestController.getAllGuests);

router.post("/lookup", guestController.lookUp);
router.post("/login", guestController.login);
router.post("/google-login", guestController.googleLogin);

router.route("/:id").delete(guestController.deleteGuest);
router.route("/getBookings").post(guestController.getBooking);
router
  .route("/updateInfo")
  .post(guestController.protect, guestController.updateGuest);

router
  .route("/bookings/:id")
  .delete(guestController.protect, bookingController.deleteBooking);

router
  .route("/bookings/:id")
  .patch(guestController.protect, bookingController.updateBooking);

module.exports = router;
