const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  numNights: {
    type: Number,
  },
  numGuests: {
    type: Number,
  },
  cabinPrice: {
    type: Number,
  },
  extraPrice: {
    type: Number,
  },
  status: {
    type: String,
  },
  hasBreakfast: {
    type: Boolean,
  },
  isPaid: {
    type: Boolean,
  },
  observations: {
    type: String,
  },
  cabinId: {
    type: mongoose.Schema.ObjectId,
    ref: "Cabins",
  },
  guestId: {
    type: mongoose.Schema.ObjectId,
    ref: "Guests",
  },
  totalPrice: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Bookings = new mongoose.model("bookings", bookingSchema);

module.exports = Bookings;
