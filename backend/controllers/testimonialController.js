// testimonialController.js
const { db } = require('../config/firebase'); // Firebase configuration

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

    // Log body and file data for debugging
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    // Check for required fields
    if (!donationJourney || !animalName || !background) {
        console.error("Missing required fields");
        return res.status(400).send("Missing required fields");
    }

    try {
        // Prepare testimonial data
        const testimonialData = {
            animalName,
            background,
            donationJourney,
            user: "Jia Wen" // Replace with actual user data if dynamic
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
