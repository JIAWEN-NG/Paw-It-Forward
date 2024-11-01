const { db } = require('../config/firebase');


const createRequest = async (req, res) => {
    const { donorId, receiverId, itemId, requestMessage, itemImage, itemsDonated } = req.body;
    try {
        // Fetch receiver details from Firestore
        const receiverDoc = await db.collection('Users').doc(receiverId).get();
        if (!receiverDoc.exists) {
            return res.status(404).json({ error: 'Receiver not found' });
        }
        const receiverData = receiverDoc.data();

        // Save the request in the 'Requests' collection
        const requestRef = await db.collection('Requests').add({
            donorId,
            receiverId,
            itemId,
            itemImage,
            itemsDonated,
            requestMessage,
            status: 'pending',
            createdAt: new Date().toISOString()
        });

        // Create a new chat in the 'Chats' collection
        const chatRef = await db.collection('Chats').add({
            participants: [donorId, receiverId],
            lastMessage: requestMessage,
            lastMessageTimestamp: new Date().toISOString(),
            requestedItem: {
                title: itemsDonated,
                image: itemImage,
                status: 'pending',
            },
            requestId: requestRef.id,
        });

        // Create the 'messages' sub-collection and add the initial message
        const messagesRef = chatRef.collection('messages');
        await messagesRef.add({
            senderId: donorId,
            receiverId: receiverId,
            message: requestMessage,
            timestamp: new Date().toISOString(),
            receiverName: receiverData.name,
            receiverProfileImage: receiverData.profileImage,
            requestId: requestRef.id
        });

        // Emit a 'newChat' event with the new chat data
        const io = req.app.get('socketio'); // Access the Socket.IO instance from Express
        io.emit('newChat', {
            chatId: chatRef.id,
            donorId,
            receiverId,
            lastMessage: requestMessage,
            lastMessageTimestamp: new Date().toISOString(),
            requestedItem: {
                title: itemsDonated,
                image: itemImage,
                status: 'pending',
            },
            requestId: requestRef.id,
            participants: [donorId, receiverId]
        });


        res.status(201).json({ message: 'Request and chat created successfully', chatId: chatRef.id });
    } catch (error) {
        console.error('Error creating request and chat:', error);
        res.status(500).json({ error: 'Error creating request and chat' });
    }
};



// Accept request
const acceptRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        // Retrieve the request document
        const requestRef = db.collection('Requests').doc(requestId);
        const requestSnapshot = await requestRef.get();

        if (!requestSnapshot.exists) {
            return res.status(404).json({ error: 'Request not found' });
        }

        const requestData = requestSnapshot.data();

        // Check if the request is already accepted or declined
        if (requestData.status !== 'pending') {
            return res.status(400).json({ error: 'Request has already been accepted or declined' });
        }

        // Update the status of the request to 'accepted'
        await requestRef.update({
            status: 'accepted'
        });

        // Fetch the chat related to this request
        const chatSnapshot = await db.collection('Chats').where('requestId', '==', requestId).get();
        if (!chatSnapshot.empty) {
            const chatRef = chatSnapshot.docs[0].ref;
            // Add an acceptance message to the chat
            await chatRef.update({
                'requestedItem.status': 'accepted',
                lastMessage: 'The request has been accepted.',
               
                lastMessageTimestamp: new Date().toISOString(),
                systemMessage: "The request has been Accepted"
            });

        }

        res.json({ message: 'Request accepted' });
    } catch (error) {
        console.error('Error accepting request:', error);
        res.status(500).json({ error: 'Error accepting request' });
    }
};

// Decline request
const declineRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        // Retrieve the request document
        const requestRef = db.collection('Requests').doc(requestId);
        const requestSnapshot = await requestRef.get();

        if (!requestSnapshot.exists) {
            return res.status(404).json({ error: 'Request not found' });
        }

        const requestData = requestSnapshot.data();

        // Check if the request is already accepted or declined
        if (requestData.status !== 'pending') {
            return res.status(400).json({ error: 'Request has already been accepted or declined' });
        }

        // Update the status of the request to 'declined'
        await requestRef.update({
            status: 'declined'
        });

        // Fetch the chat related to this request
        const chatSnapshot = await db.collection('Chats').where('requestId', '==', requestId).get();
        if (!chatSnapshot.empty) {
            const chatRef = chatSnapshot.docs[0].ref;

            // Update the chat with the declined status
            await chatRef.update({
                'requestedItem.status': 'declined',
                lastMessage: 'The request has been declined.',
                lastMessageTimestamp: new Date().toISOString(),
                systemMessage: "The request has been Declined."
            });

            // // Add a decline message to the chat
            // await chatRef.collection('messages').add({
            //     message: 'The request has been declined.',
            //     timestamp: new Date().toISOString(),
            //     systemMessage: true
            // });
        }

        res.json({ message: 'Request declined' });
    } catch (error) {
        console.error('Error declining request:', error);
        res.status(500).json({ error: 'Error declining request' });
    }
};

module.exports = {
    createRequest,
    acceptRequest,
    declineRequest
};