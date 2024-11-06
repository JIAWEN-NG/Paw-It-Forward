// controllers/adminController.js
const { db } = require('../config/firebase');
// Fetch users by status
const getUserByStatus = async (req, res) => {
    const { status } = req.query;

    try {
        let usersSnapshot;

        if (status === 'Approved') {
            usersSnapshot = await db.collection('Users').where('isPhotoVerified', '==', true).get();
        } else if (status === 'Rejected') {
            usersSnapshot = await db.collection('Users')
                .where('isPhotoVerified', '==', false)
                .where('rejectionReason', '!=', '') // Ensure this condition is valid in Firestore
                .get();
        } else if (status === 'Pending') {
            usersSnapshot = await db.collection('Users')
                .where('isPhotoVerified', '==', false)
                .where('rejectionReason', '==', '')
                .get();
        } else {
            console.error('Invalid status parameter:', status);
            return res.status(400).json({ error: 'Invalid status parameter' });
        }

        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users by status:', error);
        res.status(500).json({ error: 'Failed to fetch users by status' });
    }
};


// Approve a User
const approveUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const userRef = db.collection('Users').doc(userId);
        await userRef.update({
            isPhotoVerified: true
        });
        res.status(200).json({ message: 'User approved successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reject a User
const rejectUser = async (req, res) => {
    const userId = req.params.userId;
    const { rejectionReason } = req.body;
    try {
        const userRef = db.collection('Users').doc(userId);
        await userRef.update({
            isPhotoVerified: false,
            rejectionReason
        });
        res.status(200).json({ message: 'User rejected successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Define mock transfer function above the controller
const mockTransferMoney = async (userId, amount, accountDetails) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ success: true, transferId: `mock_transfer_${Date.now()}` });
        }, 1000);
    });
};

// Approve a Withdrawal Request
const approveWithdrawal = async (req, res) => {
    const { requestId } = req.params;
    const { amount, userId, accountDetails } = req.body;

    try {
        const transferResult = await mockTransferMoney(userId, amount, accountDetails);
        if (transferResult.success) {
            await Withdrawal.updateOne({ _id: requestId }, { 
                status: 'approved', 
                processedAt: new Date(), 
                transactionId: transferResult.transferId 
            });
            return res.status(200).json({ message: 'Withdrawal approved and transferred successfully.' });
        } else {
            return res.status(500).json({ message: 'Transfer failed.' });
        }
    } catch (error) {
        console.error('Error approving withdrawal:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
   
};



// Reject a Withdrawal Request
const rejectWithdrawal = async (req, res) => {
    const requestId = req.params.requestId;
    const { rejectionReason } = req.body;
    try {
        const withdrawalRef = db.collection('Withdrawals').doc(requestId);
        await withdrawalRef.update({
            status: "Rejected",
            rejectionReason
        });
        res.status(200).json({ message: 'Withdrawal request rejected.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get all withdrawal requests
const getAllWithdrawals = async (req, res) => {
    try {
      const withdrawalsSnapshot = await db.collection('Withdrawals').get();
      const withdrawals = withdrawalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(withdrawals);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      res.status(500).json({ error: 'Failed to fetch withdrawals' });
    }
  };
  

// // process xfer 
// // Example transfer function (using Stripe as an example)
// const stripe = require('stripe')('your-stripe-secret-key');

// async function transferMoney(userId, amount, accountDetails) {
//     try {
//         // Create a Stripe transfer
//         const transfer = await stripe.transfers.create({
//             amount: amount * 100, // Stripe uses cents for USD
//             currency: 'usd', // or any other relevant currency
//             destination: accountDetails.stripeAccountId, // User's Stripe account
//             description: `Transfer for withdrawal request by user ${userId}`,
//         });
        
//         return { success: true, transferId: transfer.id };
//     } catch (error) {
//         console.error('Error during transfer:', error);
//         return { success: false, error: error.message };
//     }
// }



// Export all functions
module.exports = {
    approveUser,
    rejectUser,
    approveWithdrawal,
    rejectWithdrawal,
    getUserByStatus,
    getAllWithdrawals

};
