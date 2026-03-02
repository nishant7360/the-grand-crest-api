const Guests = require("../model/guestsModel");
const Bookings = require("../model/bookingsModel");
const jwt = require("jsonwebtoken");
const cookieOptions = require("../utils/cookieOption");
const { promisify } = require("util");
const crypto = require("crypto");
const AppError = require("../utils/appError");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// google login
exports.googleLogin = async (req, res, next) => {
  try {
    const { email, fullName } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "fail",
        message: "Email is required",
      });
    }

    let guest = await Guests.findOne({ email });

    if (!guest) {
      guest = await Guests.create({
        email,
        fullName,
        password: crypto.randomUUID(),
        provider: "google",
      });
    }

    const token = createToken(guest._id);

    res.cookie("jwt", token, {
      ...cookieOptions,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      data: {
        guest: {
          id: guest._id,
          email: guest.email,
          fullName: guest.fullName,
        },
      },
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.signIn = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide all fields",
      });
    }

    const existingGuest = await Guests.findOne({ email });
    if (existingGuest) {
      return res.status(400).json({
        status: "fail",
        message: "Guest already exists",
      });
    }

    const newGuest = await Guests.create({
      fullName,
      email,
      password,
    });

    const token = createToken(newGuest._id);
    res.cookie("jwt", token, {
      ...cookieOptions,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      status: "success",
      token,
      data: {
        newGuest,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password both !",
      });
    }

    const guest = await Guests.findOne({ email }).select("+password");

    if (!guest || !(await guest.checkPassword(password, guest.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Please enter valid email and password",
      });
    }

    const token = createToken(guest.id);
    res.cookie("jwt", token, {
      ...cookieOptions,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    guest.password = undefined;

    return res.status(200).json({
      status: "success",
      data: {
        guest,
      },
    });
  } catch (error) {
    next(error); // 500
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    ...cookieOptions,
    maxAge: 0,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

exports.protect = async (req, res, next) => {
  try {
    let user = null;

    // COOKIE / JWT AUTH
    if (req.cookies?.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      user = await Guests.findById(decoded.id);
    }

    // GOOGLE / NEXTAUTH AUTH
    if (!user && req.headers["x-user-email"]) {
      user = await Guests.findOne({
        email: req.headers["x-user-email"],
      });
    }

    if (!user) {
      return next(new AppError("You are not logged in !", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error); // 500
  }
};

exports.deleteGuest = async (req, res, next) => {
  try {
    const doc = await Guests.findByIdAndDelete(req.id);

    if (!doc) {
      return next(new AppError("Guest not found", 404));
    }

    return res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.getAllGuests = async (req, res, next) => {
  try {
    const guests = await Guests.find();

    return res.status(200).json({
      status: "success",
      data: {
        guests,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.lookUp = async (req, res, next) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email",
      });
    }

    const guest = await Guests.findOne({ email: req.body.email });

    if (!guest) {
      return next(new AppError("No guest with this email", 404));
    }

    return res.status(200).json({
      status: "success",
      data: {
        guest,
      },
    });
  } catch (error) {
    next(error); // 500
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const bookings = await Bookings.find({ guestId: req.body.guestId })
      .populate("cabinId")
      .populate("guestId");

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    next(error); // 500
  }
};

exports.updateGuest = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "No logged in user",
      });
    }

    const { nationality, nationalID, countryFlag } = req.body;

    const updatedUser = await Guests.findByIdAndUpdate(
      req.user._id,
      { nationality, nationalID, countryFlag },
      { new: true },
    );

    return res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  } catch (error) {
    next(error); // 500
  }
};
