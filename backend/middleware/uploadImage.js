const multer = require('multer');

// Set storage engine
const storage = multer.memoryStorage(); // Store files in memory for easy access

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Increase limit to 10MB or any desired size
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
        const extname = filetypes.test(file.mimetype.toLowerCase());
        const mimetype = filetypes.test(file.originalname.toLowerCase());

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!'); // Return error if not an image
        }
    }
}).single('image'); // 'image' should match the field name in the form

// Export the upload middleware
module.exports = upload;
