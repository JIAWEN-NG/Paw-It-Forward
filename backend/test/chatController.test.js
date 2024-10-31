// tests/chatController.test.js
const request = require('supertest');
const app = require('../index'); // Import the app instance
const http = require('http'); // Import the http module
const { db } = require('../config/firebase'); // Import Firebase admin

let server; // Declare a server variable

describe('Chat Controller', () => {
    beforeAll((done) => {
        // Create the server and store it in the server variable
        server = http.createServer(app);
        server.listen(done);
    });

    afterAll(async () => {
        // Close the server and clean up test data
        await db.collection('Chats').doc('testUser123_testUser456').delete();
        server.close();
        await db.terminate(); // Close the database connection if necessary
    });

    describe('POST /api/messages/send', () => {
        it('should send a message successfully', async () => {
            const response = await request(server)
                .post('/api/messages/send')
                .send({
                    senderId: 'OpIdpWOOHnN55AlZLj6u',
                    receiverId: 'p8v0JBWhlfNZ13DzpBFN',
                    message: 'Test message',
                    requestId: 'testRequest123',
                });
        
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Chat message sent successfully');
        }, 20000); // Set timeout to 20 seconds
        

        it('should return an error if missing required fields', async () => {
            const response = await request(server)
                .post('/api/messages/send')
                .send({
                    senderId: 'testUser123',
                    message: 'Test message',
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Missing required fields');
        }, 10000);
    });

    describe('GET /api/messages/:userId/:otherUserId', () => {
        it('should retrieve messages between two users', async () => {
            const response = await request(server)
                .get('/api/messages/testUser123/testUser456');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        }, 10000);

        it('should return a 400 error for missing parameters', async () => {
            const response = await request(server)
                .get('/api/messages/testUser123/');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Missing userId or otherUserId in the request');
        }, 10000);
    });

     // New test for sendMessageForNewRequest
     describe('sendMessageForNewRequest', () => {
        it('should send a message when a new request is created', async () => {
            const response = await request(server)
                .post('/api/messages/send')
                .send({
                    senderId: 'p8v0JBWhlfNZ13DzpBFN',
                    receiverId: 'OpIdpWOOHnN55AlZLj6u',
                    message: 'Request created message',
                    requestId: 'Gs17I31mK1QDbpM6Nkbz'
                });
        
            console.log('Response:', response.body);
        
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Chat message sent successfully');
        }, 20000); // Increased timeout
        

        it('should return an error if missing required fields for new request', async () => {
            const response = await request(server)
                .post('/api/messages/send')
                .send({
                    senderId: 'donorId123',
                    message: 'Request created message',
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Missing required fields');
        }, 10000);
    });
});


