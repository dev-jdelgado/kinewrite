const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,

    // Limit file size to 2 MB
    limits: {
        fileSize: 2 * 1024 * 1024
    },

    // Allow only image files
    fileFilter: (req, file, cb) => {

        const allowedTypes = new Set([
            "image/jpeg",
            "image/png",
            "image/webp",
        ]);

        const allowedExtensions = new Set([
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
        ]);

        const extension = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.has(file.mimetype) && allowedExtensions.has(extension)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, JPEG, PNG, and WEBP image files are allowed."));
        }

    }
});

module.exports = upload;