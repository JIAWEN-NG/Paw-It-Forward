const { db, admin } = require('../config/firebase'); // Firebase configuration
const { getAuth } = require('firebase-admin/auth'); // Firebase Admin SDK for authentication

// Get all testimonials
const getAllTestimonials = async (req, res) => {
    try {
        const snapshot = await db.collection('testimonials').get();
        const testimonials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(testimonials);
    } catch (error) {
        console.error("Error retrieving testimonials:", error);
        res.status(500).send("Error retrieving testimonials.");
    }
};

const uploadTestimonial = async (req, res) => {
    const { animalName, background, donationJourney } = req.body;
    const file = req.file;

    if (!donationJourney || !animalName || !background) {
        console.error("Missing required fields:", req.body);  // Log missing fields
        return res.status(400).send("Missing required fields");
    }

    const token = req.headers.authorization && req.headers.authorization.split('Bearer ')[1]; 

    if (!token) {
        console.error("No token provided");
        return res.status(401).send("No token provided. Please log in.");
    }

    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        const userId = decodedToken.uid;

        const testimonialData = {
            animalName,
            background,
            donationJourney,
            userId,
            userName: decodedToken.name || "Anonymous"
        };

        if (file) {
            const imageBase64 = file.buffer.toString('base64');
            testimonialData.imageBase64 = imageBase64;
        }

        await db.collection('testimonials').add(testimonialData);
        res.status(200).send("Testimonial uploaded successfully.");
    } catch (error) {
        console.error("Error uploading testimonial:", error);  // Log detailed error
        res.status(500).send("Error uploading testimonial.");
    }
};


module.exports = {
    getAllTestimonials,
    uploadTestimonial
};
