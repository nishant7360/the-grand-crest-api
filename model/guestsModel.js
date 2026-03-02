const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const guestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "A guest must have a name"],
  },
  email: {
    type: String,
    required: [true, "A guest must have a mail"],
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  nationalID: {
    type: String,
  },
  nationality: {
    type: String,
  },
  countryFlag: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  lastUpdated: {
    type: Date,
  },
  role: {
    type: String,
    default: "Guest",
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dannc8wyq/image/upload/v1772174552/default-user_vswwhl.jpg",
  },
});

// guestSchema.pre("save", function (next) {
//   this.lastUpdated = new Date();
//   next();
// });

guestSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 8);
});

guestSchema.methods.checkPassword = function (candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};

const Guests = new mongoose.model("Guests", guestSchema);

module.exports = Guests;
