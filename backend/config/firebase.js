// firebase.js
var admin = require("firebase-admin");
require('dotenv').config(); // Load environment variables

// Confirm the bucket name is correctly loaded
if (!process.env.FIREBASE_STORAGE_BUCKET) {
  console.error("Error: FIREBASE_STORAGE_BUCKET environment variable is not set.");
  process.exit(1); // Exit if the bucket name is not set
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET // Set the storage bucket name
});

// Firestore and Storage Bucket references
const db = admin.firestore();
const bucket = admin.storage().bucket(); // Use the bucket from environment variable

console.log("Bucket Name:", bucket.name);

// Export the db and bucket references
module.exports = { db, admin, bucket };
