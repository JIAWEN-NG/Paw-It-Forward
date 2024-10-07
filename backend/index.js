// index.js
const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routers/dataRoutes'); // Import the router

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors());

console.log('Router is being mounted');
app.use('/api', dataRoutes); // Use the imported router

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


