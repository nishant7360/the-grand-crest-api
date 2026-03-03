const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const { getPublicIdFromUrl } = require("../utils/getFile");
const cloudinary = require("../utils/cloudinary");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const cookieOptions = require("../utils/cookieOption");

const jwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signIn = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        status: "fail",
        message: "Email ,fullName and password required",
      });
    }

    const newUser = await User.create({ fullName, email, password });

    const token = jwtToken(newUser.id);

    return res.status(201).json({
      status: "success",
      token,
      data: {
        newUser,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("cookieOptions:", cookieOptions);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password both",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.checkPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Please enter valid email and password",
      });
    }

    const token = jwtToken(user.id);

    res.cookie("jwt", token, {
      ...cookieOptions,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined;
    return res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err); // 500
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

exports.getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "You are not logged in",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError("You are not logged in ! Please login", 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
      return next(
        new AppError("User belonging to this token does't exist!", 401),
      );
    }

    req.user = freshUser;
    next();
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const allowedField = ["fullName", "email"];
    const updates = {};

    const user = await User.findById(req.user.id).select("+password");

    allowedField.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.body.newPassword) {
      if (!req.body.currentPassword) {
        return next(new AppError("current password is required", 400));
      }

      const isCorrect = await user.checkPassword(
        req.body.currentPassword,
        user.password,
      );

      if (!isCorrect) {
        return next(new AppError("Incorrect current password", 403));
      }

      user.password = req.body.newPassword;
    }

    if (req.file) {
      if (user.avatar) {
        const publicId = getPublicIdFromUrl(user.avatar);
        await cloudinary.uploader.destroy(publicId);
      }
      updates.avatar = req.file.path;
    }

    Object.assign(user, updates);
    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
