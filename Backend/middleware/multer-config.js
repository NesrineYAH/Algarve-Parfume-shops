// 📦 middleware/multer.config.js
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// 📁 Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads"); // 🔹 mieux d’utiliser "uploads" que "images"
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name}_${Date.now()}.${extension}`);
  },
});

//module.exports = multer({ storage }).single("image");
module.exports = multer({ storage }).single("image");
