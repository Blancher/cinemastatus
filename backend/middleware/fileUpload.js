const multer = require('multer');

const mimeTypes = {'image/png': 'png', 'image/jpeg': 'jpeg', 'image/jpg': 'jpg'};

module.exports = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'images');
        },
        filename(req, file, cb) {
            cb(null, `${Date.now()}.${mimeTypes[file.mimetype]}`);
        }
    }),
    fileFilter(req, file, cb) {
        const isValid = !!mimeTypes[file.mimetype];
        const error = isValid ? null : new Error('Invalid mime type.');
        cb(error, isValid);
    }
});