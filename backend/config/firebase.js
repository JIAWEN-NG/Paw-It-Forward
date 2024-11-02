
// firebase.js
var admin = require("firebase-admin");
require('dotenv').config(); // Load environment variables

// Confirm the bucket name is correctly loaded
console.log("Firebase Storage Bucket:", process.env.FIREBASE_STORAGE_BUCKET);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Set the storage bucket name
});

// Firestore and Storage Bucket references
const db = admin.firestore();
const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);
console.log("Bucket Name:", bucket.name);

// Export the db and bucket references
module.exports = { db, admin, bucket };
const storage = admin.storage().bucket();

module.exports = { db, admin, storage };


