const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const jwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const newUser = await User.create({ fullName, email, password });

    const token = jwtToken(newUser.id);

    return res.status(201).json({
      status: "success",
      token,
      data: {
        newUser,
      },
    });
  } catch (error) {
    next(error); // 500 via global error handler
  }
};
