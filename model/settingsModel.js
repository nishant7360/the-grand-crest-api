const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  minBookingLength: {
    type: Number,
    default: 6,
  },
  maxBookingLength: {
    type: Number,
    default: 19,
  },
  maxGuestsPerBooking: {
    type: Number,
    default: 200,
  },
  breakfastPrice: {
    type: Number,
    default: 19.99,
  },
  totalPrice: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Settings = new mongoose.model("settings", settingSchema);

module.exports = Settings;
