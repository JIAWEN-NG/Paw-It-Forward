// withdrawalModel.js
class Withdrawal {
    constructor(id, accountNo, amountWithdraw, proofImg, postId, reason, requestedAt, userId) {
        this.id = id;
        this.accountNo = accountNo;
        this.amountWithdraw = amountWithdraw;
        this.proofImg = proofImg;
        this.postId = postId;
        this.reason = reason;
        this.requestedAt = requestedAt;
        this.userId = userId;
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
            data.userId
        );
    }
}

module.exports = Withdrawal;
