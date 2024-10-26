// fundraisingModel.js
class Fundraising {
    constructor(id, userId, title, description, targetAmount, amountRaised, createdAt, fundraisingImg) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.petType = petType;
        this.targetAmount = targetAmount;
        this.amountRaised = amountRaised || 0; // Default to 0 if not provided
        this.createdAt = createdAt;
        this.fundraisingImg = fundraisingImg; // URL for fundraising campaign image
    }

    toFirestore() {
        return {
            userId: this.userId,
            title: this.title,
            description: this.description,
            petType: this.petType,
            targetAmount: this.targetAmount,
            amountRaised: this.amountRaised,
            createdAt: this.createdAt,
            fundraisingImg: this.fundraisingImg,
        };
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Fundraising(
            snapshot.id,
            data.userId,
            data.title,
            data.description,
            data.petType || "Unknown",
            data.targetAmount,
            data.amountRaised || 0, // Default to 0 if not provided
            data.createdAt ? data.createdAt.toDate().toISOString() : null, // Format date if exists
            data.fundraisingImg || "" // Default to an empty string if no image provided
        );
    }
}

module.exports = Fundraising;
