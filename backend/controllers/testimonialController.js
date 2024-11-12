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

// Upload a new testimonial with an optional image
const uploadTestimonial = async (req, res) => {
    const { animalName, background, donationJourney } = req.body;
    const file = req.file;

    // Check for required fields
    if (!donationJourney || !animalName || !background) {
        console.error("Missing required fields");
        return res.status(400).send("Missing required fields");
    }

    // Extract the Firebase Auth token from the request header
    const token = req.headers.authorization && req.headers.authorization.split('Bearer ')[1]; 

    if (!token) {
        return res.status(401).send("No token provided. Please log in.");
    }

    try {
        // Verify the token using Firebase Admin SDK
        const decodedToken = await getAuth().verifyIdToken(token);
        const userId = decodedToken.uid; // Get the Firebase UID of the user

        // Prepare testimonial data
        const testimonialData = {
            animalName,
            background,
            donationJourney,
            userId,  // Add userId to the testimonial data
            userName: decodedToken.name || "Anonymous" // You can also add user's name from the token if available
        };

        // If an image file is uploaded, convert it to Base64 and add to testimonial data
        if (file) {
            const imageBase64 = file.buffer.toString('base64');
            testimonialData.imageBase64 = imageBase64;
        }

        // Save testimonial data to Firestore
        await db.collection('testimonials').add(testimonialData);

        res.status(200).send("Testimonial uploaded successfully.");
    } catch (error) {
        console.error("Error uploading testimonial:", error);
        res.status(500).send("Error uploading testimonial.");
    }
};

module.exports = {
    getAllTestimonials,
    uploadTestimonial
};
