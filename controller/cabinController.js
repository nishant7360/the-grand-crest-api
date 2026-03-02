const Cabins = require("../model/cabinModel.js");
const cloudinary = require("../utils/cloudinary.js");
const { getPublicIdFromUrl } = require("../utils/getFile.js");
const AppError = require("../utils/appError");

exports.createCabin = async (req, res, next) => {
  try {
    const cabinData = { ...req.body };

    if (req.file) {
      cabinData.image = req.file.path;
    } else if (req.image) {
      cabinData.image = req.image;
    }

    const newCabin = await Cabins.create(cabinData);

    res.status(201).json({
      status: "success",
      data: {
        newCabin,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.getAllCabins = async (req, res, next) => {
  try {
    const cabins = await Cabins.find();

    res.status(200).json({
      status: "success",
      data: {
        cabins,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.getById = async (req, res, next) => {
  try {
    const cabin = await Cabins.findById(req.params.id);

    if (!cabin) {
      return next(new AppError("No cabin with this id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        cabin,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.deleteCabin = async (req, res, next) => {
  try {
    const doc = await Cabins.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No cabin with this id", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err); // 500
  }
};

exports.updateCabin = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "max_capacity",
      "regular_price",
      "discount",
      "description",
      "image",
    ];

    const updates = {};
    const cabin = await Cabins.findById(req.params.id);

    if (!cabin) {
      return next(new AppError("Cabin not found", 404));
    }

    if (req.file) {
      if (cabin.image) {
        const publicId = getPublicIdFromUrl(cabin.image);
        await cloudinary.uploader.destroy(publicId);
      }
      cabin.image = req.file.path;
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(cabin, updates);
    await cabin.save();

    return res.status(200).json({
      status: "success",
      data: {
        cabin,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};
