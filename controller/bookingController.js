const Bookings = require("../model/bookingsModel");
const { updateCabin } = require("./cabinController");
const AppError = require("../utils/appError");

const PAGE_SIZE = 10;

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await Bookings.create(req.body);

    return res.status(201).json({
      status: "success",
      data: {
        booking,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const { filter, sortBy, limit, page, startDate, endDate } = req.query;

    let mongoFilter = {};

    if (startDate && endDate) {
      mongoFilter.created_at = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (filter) {
      const { field, value, method = "eq" } = JSON.parse(filter);
      if (method === "eq") mongoFilter[field] = value;
      if (method === "gte") mongoFilter[field] = { $gte: value };
      if (method === "lte") mongoFilter[field] = { $lte: value };
      if (method === "gt") mongoFilter[field] = { $gt: value };
      if (method === "lt") mongoFilter[field] = { $lt: value };
    }

    let mongoSort = {};
    if (sortBy) {
      const { field, direction } = JSON.parse(sortBy);
      mongoSort[field] = direction === "asc" ? 1 : -1;
    }

    const currentPage = Number(page) || 1;
    const pageLimit = Number(limit) || PAGE_SIZE;
    const skip = (currentPage - 1) * pageLimit;

    const bookings = await Bookings.find(mongoFilter)
      .populate("cabinId", "name max_capacity")
      .populate("guestId", "fullName email")
      .sort(mongoSort)
      .skip(skip)
      .limit(pageLimit);

    const count = await Bookings.countDocuments(mongoFilter);

    res.status(200).json({
      status: "success",
      count,
      data: {
        bookings,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Bookings.findById(req.params.id)
      .populate("cabinId", "name regular_price max_capacity")
      .populate("guestId", "fullName email nationalID");

    if (!booking) {
      return next(new AppError("No booking with this id", 404));
    }

    return res.status(200).json({
      status: "success",
      data: {
        booking,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const updatedBooking = await Bookings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedBooking) {
      return next(new AppError("Booking not found", 404));
    }

    return res.status(200).json({
      status: "success",
      data: {
        updatedBooking,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Bookings.findByIdAndDelete(req.params.id);

    if (!booking) {
      return next(new AppError("Booking not found", 404));
    }

    return res.status(200).json({
      status: "success",
      data: {
        booking,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};
