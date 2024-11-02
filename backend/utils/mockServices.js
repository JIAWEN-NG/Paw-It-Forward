// mockServices.js
const mockTransferMoney = async (userId, amount, accountDetails) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ success: true, transferId: `mock_transfer_${Date.now()}` });
        }, 1000);
    });
};

module.exports = { mockTransferMoney };
