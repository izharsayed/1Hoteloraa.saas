"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);

var _errormiddleware = require('./error.middleware');

// Set storage engine
const storage = _multer2.default.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, _path2.default.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}${_path2.default.extname(file.originalname)}`);
  },
});

// File filter to allow only images
const fileFilter = (_req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(_errormiddleware.createError.call(void 0, 'Only image files (jpeg, png, jpg, webp, gif) are allowed', 400));
  }
};

// Create the multer upload instance
 const uploadImage = _multer2.default.call(void 0, {
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}); exports.uploadImage = uploadImage;
