const settingsController = require("../controller/settingsController");
const authController = require("../controller/authController");
const express = require("express");

const router = express.Router();

router
  .route("/")
  .patch(authController.protect, settingsController.updateSettings);

router.route("/").get(settingsController.getSettings);

module.exports = router;
