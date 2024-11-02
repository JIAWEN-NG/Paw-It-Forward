// index.js
const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routers/dataRoutes'); // Import the router
//afsana added
const { db } = require('./config/firebase'); // Ensure this is correctly imported

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors());

// // Afsana added - Add a root route
// app.get('/', (req, res) => {
//     res.send('Welcome to the API!'); // You can customize this response
// });

console.log('Router is being mounted');
app.use('/api', dataRoutes); 

// Health check endpoint
app.get('/get-data', async (req, res) => {
    try {
        const snapshot = await db.collection('Users').get();
        const data = snapshot.docs.map(doc => doc.data());
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.listen(PORT, () => {
    console.log(`[SYSTEM] Server started on port ${PORT}...`);
    
});


