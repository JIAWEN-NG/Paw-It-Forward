// adminController.test.js
const adminController = require('../contollers/adminController');
const { mockTransferMoney } = require('../utils/mockServices');

// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => {
    const original = jest.requireActual('firebase-admin');
    const mFirestore = {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue(),
    };
    return {
        ...original,
        initializeApp: jest.fn(),
        credential: { cert: jest.fn() },
        firestore: jest.fn(() => mFirestore),
        storage: jest.fn(() => ({ bucket: jest.fn() })),
    };
});

jest.mock('../utils/mockServices'); // Mock the mockTransferMoney module

const admin = require('firebase-admin');
const db = admin.firestore();

describe('mockTransferMoney', () => {
    test('should resolve with a transfer ID', async () => {
        // Set up mockTransferMoney to return a successful transfer response
        mockTransferMoney.mockResolvedValue({ success: true, transferId: 'mock_transfer_12345' });

        const userId = 'testUser';
        const amount = 100;
        const accountDetails = { accountId: 'mockAccount' };

        const result = await mockTransferMoney(userId, amount, accountDetails);

        expect(result.success).toBe(true);
        expect(result.transferId).toMatch(/mock_transfer_/);
    });
});

describe('adminController.approveWithdrawal', () => {
    beforeEach(() => {
        // Mock successful transfer response and Firestore update
        mockTransferMoney.mockResolvedValue({ success: true, transferId: 'mock_transfer_12345' });
        db.doc().update.mockResolvedValue();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should approve withdrawal and update Firestore', async () => {
        const req = {
            params: { requestId: 'req123' },
            body: {
                amount: 100,
                userId: 'testUser',
                accountDetails: { accountId: 'mockAccount' },
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await adminController.approveWithdrawal(req, res);

        expect(mockTransferMoney).toHaveBeenCalledWith('testUser', 100, { accountId: 'mockAccount' });
        expect(db.collection).toHaveBeenCalledWith('Withdrawals');
        expect(db.doc).toHaveBeenCalledWith('req123');
        expect(db.doc().update).toHaveBeenCalledWith({
            status: 'approved',
            processedAt: expect.any(Date),
            transactionId: 'mock_transfer_12345'
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Withdrawal approved and transferred successfully.' });
    });
});
