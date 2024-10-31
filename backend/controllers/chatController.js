const { db } = require('../config/firebase');

// Helper function to get user data
const getUserData = async (userId) => {
    const userDoc = await db.collection('Users').doc(userId).get();
    if (!userDoc.exists) {
        throw new Error('User not found');
    }
    return userDoc.data();
};


// Function to send a message
const sendMessage = async (req, res) => {
    const { senderId, receiverId, message, requestId, requestedItem } = req.body;

    if (!senderId || !receiverId || !message || !requestId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Step 1: Find an existing chat for the same participants and request
        const chatsSnapshot = await db.collection('Chats')
            .where('participants', 'array-contains', senderId)
            .where('requestId', '==', requestId)
            .get();

        let chatId;
        if (!chatsSnapshot.empty) {
            // Find the chat that contains both participants
            chatId = chatsSnapshot.docs.find(doc => {
                const participants = doc.data().participants;
                return participants.includes(receiverId);
            })?.id;

            // If no chat matches both participants, create a new one
            if (!chatId) {
                const newChatRef = db.collection('Chats').doc();
                chatId = newChatRef.id;

                await newChatRef.set({
                    participants: [senderId, receiverId].filter(Boolean), // Ensure no undefined values
                    lastMessage: message,
                    lastMessageTimestamp: new Date().toISOString(),
                    requestId: requestId,
                    requestedItem: requestedItem,
                });
            }
        } else {
            // No chat exists at all, so create a new one
            const newChatRef = db.collection('Chats').doc();
            chatId = newChatRef.id;

            await newChatRef.set({
                participants: [senderId, receiverId].filter(Boolean),
                lastMessage: message,
                lastMessageTimestamp: new Date().toISOString(),
                requestId: requestId,
                requestedItem: requestedItem,
            });
        }

        // Step 2: Fetch receiver data for the message details
        const receiverData = await getUserData(receiverId);

        // Step 3: Prepare the message data
        const newMessage = {
            senderId,
            receiverId,
            message,
            requestId,
            timestamp: new Date().toISOString(),
            receiverName: receiverData.name,
            receiverProfileImage: receiverData.profileImage,
        };

        // Step 4: Save the message in the messages subcollection of the chat
        await db.collection('Chats').doc(chatId).collection('messages').add(newMessage);

        // Update the chat document with the latest message and timestamp
        await db.collection('Chats').doc(chatId).update({
            lastMessage: message,
            lastMessageTimestamp: newMessage.timestamp,
        });

         // Emit the new message to the room using Socket.IO
         const io = req.app.get('socketio'); // Access the Socket.IO instance from Express
        //  io.to(chatId).emit('newMessage', newMessage);
        io.emit('newMessage', newMessage);

        return res.status(201).json({ message: 'Chat message sent successfully', chatId });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
};





// Function to retrieve messages for a chat
const retrieveMessages = async (req, res) => {
    const { chatId } = req.params;

    if (!chatId) {
        return res.status(400).json({ error: 'Missing chatId in the request' });
    }

    try {
        // Reference the chat document
        const chatRef = db.collection('Chats').doc(chatId);
        const chatDoc = await chatRef.get();

        // Check if the chat exists
        if (!chatDoc.exists) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        // Fetch the messages within the chat's 'messages' subcollection
        const messagesSnapshot = await chatRef.collection('messages').orderBy('timestamp').get();

        if (messagesSnapshot.empty) {
            return res.status(200).json([]); // Return an empty array if no messages exist
        }

        // Map through the messages to format them properly
        const messages = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Optional: Return chat details alongside messages
        const chatData = chatDoc.data();
        const response = {
            chatId,
            participants: chatData.participants,
            lastMessage: chatData.lastMessage,
            lastMessageTimestamp: chatData.lastMessageTimestamp,
            requestedItem: chatData.requestedItem,
            messages
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        return res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};
// Function to retrieve all chats for a user
const getUserChats = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId in the request' });
    }

    try {
        // Fetch all chats where the user is a participant and order by the lastMessageTimestamp in descending order
        const chatsSnapshot = await db.collection('Chats')
            .where('participants', 'array-contains', userId)
            .orderBy('lastMessageTimestamp', 'desc') // Order by timestamp in descending order
            .get();

        const chats = chatsSnapshot.docs.map(doc => ({
            chatID: doc.id,
            ...doc.data()
        }));

        return res.status(200).json(chats);
    } catch (error) {
        console.error('Error retrieving chats:', error);
        return res.status(500).json({ error: 'Failed to retrieve chats' });
    }
};




module.exports = {
    sendMessage,
    retrieveMessages,
    getUserChats,
};
