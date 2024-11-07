// withdrawalModel.js
class Withdrawal {
    constructor(id, accountNo, amountWithdraw, proofImg, postId, reason, requestedAt, userId, status = 'Pending', username = '') {
        this.id = id;
        this.accountNo = accountNo;
        this.amountWithdraw = amountWithdraw;
        this.proofImg = proofImg;
        this.postId = postId;
        this.reason = reason;
        this.requestedAt = requestedAt;
        this.userId = userId;
        this.status = status; // New field for status
        this.username = username; // New field for username
    }

    toFirestore() {
        return {
            accountNo: this.accountNo,
            amountWithdraw: this.amountWithdraw,
            proofImg: this.proofImg,
            postId: this.postId,
            reason: this.reason,
            requestedAt: this.requestedAt,
            userId: this.userId,
            status: this.status, 
            username: this.username, 
        };
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Withdrawal(
            snapshot.id,
            data.accountNo,
            data.amountWithdraw,
            data.proofImg || '',
            data.postId,
            data.reason || 'No reason provided',
            data.requestedAt ? data.requestedAt.toDate().toISOString() : null,
            data.userId,
            data.status || 'Pending', // Default status if not provided
            data.username || '' // Default empty string for username if not provided
        );
    }
}

module.exports = Withdrawal;
