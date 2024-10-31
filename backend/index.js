// index.js
const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routers/dataRoutes'); // Import the router
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const PORT = 8000;
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow the frontend to connect
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

app.use(express.json());
app.use(cors());

// console.log('Router is being mounted');
app.use('/api', dataRoutes); // Use the imported router
app.use(bodyParser.json()); // To parse JSON request bodies

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
// Attach the Socket.IO instance to the Express app
app.set('socketio', io);
// WebSocket connection setup
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Example: Listen for a message event from the client
    socket.on('joinChat', (chatId) => {
        socket.join(chatId); // Join a room for the specific chat
        console.log(`User joined chat: ${chatId}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// In index.js or main server file
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('testEvent', { message: 'Hello from server' });
});
io.on('connection', (socket) => {
    console.log('Client connected');

    // Send a test newMessage event after connection
    setTimeout(() => {
        socket.emit('newMessage', {
            senderId: 'testUser',
            receiverId: 'testReceiver',
            message: 'This is a test message',
            requestId: 'testRequestId',
            timestamp: new Date().toISOString(),
        });
    }, 3000);
});


// app.listen(PORT, () => {
//     console.log(`[SYSTEM] Server started on port ${PORT}...`);
    
// });
// Only start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`[SYSTEM] Server started on port ${PORT}...`);
    });
}

module.exports = app; // Export the app instance for testing


