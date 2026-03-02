const express = require("express");
const authController = require("../controller/authController.js");
const userController = require("../controller/userController.js");
const uploadTo = require("../utils/multer.js");
const router = express.Router();

router.route("/signin").post(authController.signIn);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);
router.route("/getMe").get(authController.protect, authController.getMe);
router.route("/createUser").post(userController.createUser);
router
  .route("/updateMe")
  .patch(
    authController.protect,
    uploadTo("user").single("avatar"),
    authController.updateUser,
  );

router.route("/:id").delete(authController.protect, authController.deleteUser);

module.exports = router;
