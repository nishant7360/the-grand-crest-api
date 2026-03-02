const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name required"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email required"],
    trim: true,
    validate: [validator.isEmail, "Please provide valid email"],
    index: true,
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dannc8wyq/image/upload/v1772174552/default-user_vswwhl.jpg",
  },
  role: {
    type: String,
    default: "employee",
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 8);
});

userSchema.methods.checkPassword = function (candidatesPassword, userPassword) {
  return bcrypt.compare(candidatesPassword, userPassword);
};

// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {};
const User = new mongoose.model("User", userSchema);

module.exports = User;
