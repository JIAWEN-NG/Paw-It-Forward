// models/PaymentModel.js

class Payment {
    constructor(id, donationAmount, userId, postId, createdAt) {
      this.id = id;
      this.donationAmount = donationAmount;
      this.userId = userId;
      this.postId = postId;
      this.createdAt = createdAt;
    }
  
    // Method to format data for Firestore
    toFirestore() {
      return {
        id: this.id,
        donationAmount: this.donationAmount,
        userId: this.userId,
        postId: this.postId,
        createdAt: this.createdAt
      };
    }
  
    // Method to create a Payment instance from Firestore data
    static fromFirestore(snapshot) {
      const data = snapshot.data();
      return new Payment(
        snapshot.id,                  // Use the document ID as the payment ID
        data.donationAmount,
        data.userId,
        data.postId,
        data.createdAt ? data.createdAt.toDate() : new Date()  // Convert Firestore timestamp to JS Date
      );
    }
  }
  
  module.exports = Payment;
  