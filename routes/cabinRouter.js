const express = require("express");
const cabinController = require("../controller/cabinController");
const authController = require("../controller/authController.js");
const uploadTo = require("../utils/multer.js");
const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    uploadTo("cabin").single("image"),
    cabinController.createCabin,
  )
  .get(cabinController.getAllCabins);

router
  .route("/:id")
  .get(cabinController.getById)
  .delete(authController.protect, cabinController.deleteCabin)
  .patch(uploadTo("cabin").single("image"), cabinController.updateCabin);

module.exports = router;
