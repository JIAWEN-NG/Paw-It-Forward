//marketplaceModel.js
class Donation {
    constructor(id, donorId, donorName, donorProfileImage, receiverId, requestId, itemsDonated, condition, itemCategory, petType, breed, itemImage, createdAt, itemDescription) {
        this.id = id;
        this.donorId = donorId;
        this.donorName = donorName;
        this.donorProfileImage = donorProfileImage;
        this.receiverId = receiverId;
        this.requestId = requestId;
        this.itemsDonated = itemsDonated;
        this.condition = condition;
        this.itemCategory = itemCategory; // New field
        this.petType = petType; // New field
        this.breed = breed; // New field
        this.itemImage = itemImage; // New field for item image
        this.createdAt = createdAt;
        this.itemDescription = itemDescription; // New field for item description
    }

    toFirestore() {
        return {
            donorId: this.donorId,
            donorName: this.donorName,
            donorProfileImage: this.donorProfileImage,
            receiverId: this.receiverId,
            requestId: this.requestId,
            itemsDonated: this.itemsDonated,
            condition: this.condition,
            itemCategory: this.itemCategory, // Add to Firestore format
            petType: this.petType, // Add to Firestore format
            breed: this.breed, // Add to Firestore format
            itemImage: this.itemImage, // Add itemImage to Firestore format
            createdAt: this.createdAt,
        };
    }

    static fromFirestore(snapshot) {
        const data = snapshot.data();
        return new Donation(
            snapshot.id,
            data.donorId,
            data.donorName,
            data.donorProfileImage,
            data.receiverId,
            data.requestId,
            data.itemsDonated,
            data.condition || "Unknown",
            data.itemCategory || "Unknown", // Add from Firestore
            data.petType || "Unknown", // Add from Firestore
            data.breed || "", // Add from Firestore
            data.itemImage || "", // Add itemImage from Firestore
            data.createdAt ? data.createdAt.toDate().toISOString() : null,
        );
    }
}

module.exports = Donation;
