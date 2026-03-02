const mongoose = require("mongoose");

const cabinSchem = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A cabin must have a name"],
    unique: true,
  },
  max_capacity: {
    type: Number,
    required: [true, "A cabin must max capacity"],
  },
  regular_price: {
    type: Number,
    required: [true, "A cabin must have a price"],
  },
  discount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: [true, "A cabin must have a description"],
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cabins = mongoose.model("Cabins", cabinSchem);
module.exports = Cabins;
