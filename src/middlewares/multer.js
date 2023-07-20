const multer = require('multer');
const fs = require('fs');

let defaultPath = "public/images";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isDirectoryExist = fs.existsSync(`${defaultPath}/${file.fieldname}`);
    if (!isDirectoryExist) {
      fs.mkdirSync(`${defaultPath}/${file.fieldname}`, {
        recursive: true,
      });
    }
    cb(null, `${defaultPath}/${file.fieldname}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1000)}.${file.mimetype.split('/')[1]}`);
  }
});

const maxSize = 1 * 1000 * 1000;
const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split('/')[1];
  if (fileType === 'jpeg' || fileType === 'png' || fileType === 'jpg') {
    cb(null, true);
  } else {
    cb(new Error("File format tidak didukung"), false);
  }
}

exports.multerUpload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter
});
