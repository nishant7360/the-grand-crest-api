const Settings = require("../model/settingsModel");

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.find();

    return res.status(200).json({
      status: "success",
      data: {
        settings,
      },
    });
  } catch (error) {
    next(error); // 500
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const updatedSettings = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    return res.status(200).json({
      status: "success",
      data: {
        updatedSettings,
      },
    });
  } catch (err) {
    next(err); // 500
  }
};
