//requestController.js
//need a post request to db function

const { db } = require('../config/firebase');

const createRequest = async (req, res) => {
    const { donorId, itemImage, itemsDonated, receiverId, requestMessage, status = "pending" } = req.body;
   
    try {
        // Check required fields and log any missing ones
        if (!donorId || !itemImage || !itemsDonated || !receiverId || !requestMessage) {
            console.error('Missing required fields:', { donorId, itemImage, itemsDonated, receiverId, requestMessage });
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Ensure donor exists in Users collection
        const donorRef = db.collection('Users').doc(donorId);
        const donorDoc = await donorRef.get();

        if (!donorDoc.exists) {
            console.error('Donor not found in Users collection for donorId:', donorId);
            return res.status(404).json({ message: 'Donor not found' });
        }
        const donorData = donorDoc.data();

        // Create request document in Requests collection
        const newRequest = {
            donorId,
            itemImage,
            itemsDonated,
            receiverId,
            requestMessage,
            status,
            createdAt: new Date(),
        };

        const requestRef = await db.collection('Requests').add(newRequest);
       

        //jw added from here
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
            senderId: receiverId,
            receiverId: donorId,
            message: requestMessage,
            timestamp: new Date().toISOString(),
            receiverName: donorData.name,
            receiverProfileImage: donorData.profileImage,
            requestId: requestRef.id
        });

        // Emit a 'newChat' event with the new chat data
        const io = req.app.get('socketio'); // Access the Socket.IO instance from Express
        io.emit('newChat', {
            chatId: chatRef.id,
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


        res.status(201).json({ message: 'Request and chat created successfully', chatId: chatRef.id, request: newRequest });

        //res.status(201).json({ message: 'Request created successfully', request: newRequest });
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

