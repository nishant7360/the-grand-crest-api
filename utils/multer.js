const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("./cloudinary.js");

function createCloudinaryStorage(folder) {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ width: 1200, height: 800, crop: "limit" }],
    },
  });
}

function uploadTo(folder) {
  return multer({
    storage: createCloudinaryStorage(folder),
  });
}

module.exports = uploadTo;
