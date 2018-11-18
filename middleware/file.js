const multer = require("multer");

// muter will extract single file from property named 'image'

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

// Configure how multer store the data
const storage = multer.diskStorage({
  //Executed when multer tries to save a file, cb: callback
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type!");
    if (isValid) {
      error = null;
    }
    // pass back information to multer where to store the file
    // relative path to server.js, null for error handle
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLocaleLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype]; // extension
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

module.exports = multer({ storage: storage }).single("image");
