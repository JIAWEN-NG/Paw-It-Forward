//marketplaceController.js
const { db, admin } = require('../config/firebase');

// Function to create a new donation in marketplace db
const createDonation = async (req, res) => {
    const { itemsDonated, condition, itemCategory, petType, breed } = req.body;
    const donorId = "p8v0JBWhlfNZ13DzpBFN"; // Default donor ID

    try {
        // Validate required fields
        if (!itemsDonated || !condition || !itemCategory || !petType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Ensure the donor exists in the Users collection
        const donorRef = db.collection('Users').doc(donorId);
        const donorDoc = await donorRef.get();

        if (!donorDoc.exists) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        // Handle image upload if present
        let itemImage = '';
        if (req.file) {
            const bucket = admin.storage().bucket(); // Get the Firebase Storage bucket
            const fileName = `donations/${donorId}/${Date.now()}_${req.file.originalname}`;
            const file = bucket.file(fileName);

            try {
                // Upload the image to Firebase Storage
                await file.save(req.file.buffer, {
                    metadata: { contentType: req.file.mimetype },
                    resumable: false,
                });

                // Get the file's public URL using Firebase Storage format
                itemImage = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
            } catch (uploadError) {
                console.error('Error uploading image:', uploadError.message);
                return res.status(500).json({ message: 'Image upload failed', error: uploadError.message });
            }
        }

        // Create a new donation document in the Marketplace collection
        const newDonation = {
            donorId,
            donorName: donorDoc.data().name || "Unknown",
            donorProfileImage: donorDoc.data().profileImage || "",
            receiverId: "", // Set as empty
            requestId: "", // Set as empty
            itemsDonated: itemsDonated || "",
            condition: condition || "Unknown",
            itemCategory: itemCategory || "Unknown",
            petType: petType || "Unknown",
            breed: breed || "",
            createdAt: admin.firestore.Timestamp.now(), // Firestore timestamp for createdAt
            itemImage // Save the image URL if it was uploaded
        };

        // Add new donation to the Marketplace collection
        const donationRef = await db.collection('Marketplace').add(newDonation);
        const createdDonation = { id: donationRef.id, ...newDonation };

        // Return the newly created donation with the auto-generated ID
        res.status(201).json(createdDonation);
    } catch (error) {
        console.error('Error creating donation:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Function to get all donations from marketplace db
const getAllDonations = async (req, res) => {
    const { donorId, receiverId } = req.query;
    try {
        let donationsRef = db.collection('Marketplace');

        if (donorId) {
            donationsRef = donationsRef.where('donorId', '==', donorId);
        }

        if (receiverId) {
            donationsRef = donationsRef.where('receiverId', '==', receiverId);
        }

        const snapshot = await donationsRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No donations found' });
        }

        const donations = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();

            // Fetch donor's data from Users collection
            const donorRef = db.collection('Users').doc(data.donorId);
            const donorDoc = await donorRef.get();
            const donorData = donorDoc.exists ? donorDoc.data() : {};

            return {
                id: doc.id,
                donorId: data.donorId,
                donorName: donorData.name || "Unknown",
                donorProfileImage: donorData.profileImage || "",
                receiverId: data.receiverId,
                requestId: data.requestId,
                itemsDonated: data.itemsDonated,
                condition: data.condition || "Unknown",
                itemCategory: data.itemCategory || "Unknown",
                petType: data.petType || "Unknown",
                breed: data.breed || "",
                itemImage: data.itemImage || "",
                createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null
            };
        }));

        res.status(200).json(donations);
    } catch (error) {
        console.error('Error fetching donations:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Function to get donation by ID from the marketplace database
const getDonationById = async (req, res) => {
    let donorId = req.params.id; // Get the donorId from the params as "id"

    // Check if the donorId is missing or is an empty string, then assign the default donorId
    if (!donorId || donorId.trim() === "") {
        donorId = "p8v0JBWhlfNZ13DzpBFN"; // Default to your donorId if not provided
    }

    console.log(`Received donorId: ${donorId}`);

    try {
        // Query the Marketplace collection for donations by donorId
        const donationsRef = db.collection('Marketplace').where('donorId', '==', donorId);
        const snapshot = await donationsRef.get();

        if (snapshot.empty) {
            console.log('No donations found for this donorId');
            return res.status(404).json({ message: 'No donations found for this donorId' });
        }

        // Prepare the donations to return
        const donations = await Promise.all(snapshot.docs.map(async (doc) => {
            const donationData = doc.data();

            // Fetch donor's data from Users collection
            const donorRef = db.collection('Users').doc(donationData.donorId);
            const donorDoc = await donorRef.get();
            const donorData = donorDoc.exists ? donorDoc.data() : {};

            return {
                id: doc.id,
                donorId: donationData.donorId,
                donorName: donorData.name || "Unknown",
                donorProfileImage: donorData.profileImage || "",
                receiverId: donationData.receiverId,
                requestId: donationData.requestId,
                itemsDonated: donationData.itemsDonated,
                condition: donationData.condition || "Unknown",
                itemCategory: donationData.itemCategory || "Unknown",
                petType: donationData.petType || "Unknown",
                breed: donationData.breed || "",
                itemImage: donationData.itemImage || "",
                createdAt: donationData.createdAt ? donationData.createdAt.toDate().toISOString() : null
            };
        }));

        res.status(200).json(donations); // Return an array of donations
    } catch (error) {
        console.error('Error fetching donations:', error.message);
        res.status(500).json({ error: error.message });
    }
};

//user is logged in, under manage posts able to delete their own listings
const deleteDonation = async (req, res) => {
    const { id } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ message: 'Marketplace listing ID is required' });
        }

        const listingRef = db.collection('Marketplace').doc(id);

        // Check if the listing exists in the Marketplace collection
        const doc = await listingRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Marketplace listing not found' });
        }

        // Authorization check (assuming `donorId` is the field for the user who created the listing)
        const data = doc.data();
        const userId = "p8v0JBWhlfNZ13DzpBFN"; // Replace with actual authenticated user ID
        if (data.donorId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this listing' });
        }

        // Delete the listing
        await listingRef.delete();

        res.status(200).json({ message: 'Marketplace listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting marketplace listing:', error.message);
        res.status(500).json({ error: error.message });
    }
};


//user is logged in, under manage posts can edit original post details
// const editDonation = async (req, res) => {
//     const { id, itemCategory, condition, petType, breed } = req.body;

//     try {
//         // Check for required fields
//         if (!id || !itemCategory || !condition || !petType) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }

//         const listingRef = db.collection('Marketplace').doc(id);

//         // Verify that the listing exists
//         const doc = await listingRef.get();
//         if (!doc.exists) {
//             return res.status(404).json({ message: 'Marketplace listing not found' });
//         }

//         // Authorization check (assuming donorId is used for the owner’s ID)
//         const data = doc.data();
//         const userId = "p8v0JBWhlfNZ13DzpBFN"; // Replace with authenticated user's ID
//         if (data.donorId !== userId) {
//             return res.status(403).json({ message: 'Unauthorized to edit this listing' });
//         }

//         // Prepare updated data without updatedAt
//         const updatedListing = {
//             itemCategory,
//             condition,
//             petType,
//             breed
//         };

//         // Update the listing
//         await listingRef.update(updatedListing);

//         res.status(200).json({ message: 'Marketplace listing updated successfully', updatedListing });
//     } catch (error) {
//         console.error('Error updating marketplace listing:', error.message);
//         res.status(500).json({ error: error.message });
//     }
// };

const editDonation = async (req, res) => {
    const { id, itemCategory, condition, petType, breed } = req.body;
  
    try {
      if (!id || !itemCategory || !condition || !petType) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const listingRef = db.collection('Marketplace').doc(id);
      const doc = await listingRef.get();
      if (!doc.exists) {
        return res.status(404).json({ message: 'Marketplace listing not found' });
      }
  
      const data = doc.data();
      const userId = "p8v0JBWhlfNZ13DzpBFN"; // Replace with authenticated user's ID
      if (data.donorId !== userId) {
        return res.status(403).json({ message: 'Unauthorized to edit this listing' });
      }
  
      // Prepare updated data
      const updatedListing = { itemCategory, condition, petType, breed };
  
      // Handle new image upload if provided
      if (req.file) {
        const bucket = admin.storage().bucket();
        const fileName = `donations/${userId}/${Date.now()}_${req.file.originalname}`;
        const file = bucket.file(fileName);
        await file.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
          resumable: false,
        });
        const newImageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
        updatedListing.itemImage = newImageUrl;
      }
  
      await listingRef.update(updatedListing);
  
      res.status(200).json({ message: 'Marketplace listing updated successfully', updatedListing });
    } catch (error) {
      console.error('Error updating marketplace listing:', error.message);
      res.status(500).json({ error: error.message });
    }
  };


module.exports = {
    createDonation,
    getAllDonations,
    getDonationById,
    deleteDonation,
    editDonation,
};
