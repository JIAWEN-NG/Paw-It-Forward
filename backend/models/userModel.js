// models/userModel.js

class User {
    constructor(id, name, email, petDescription = '', role = 'user', profileImage = 'https://firebasestorage.googleapis.com/v0/b/purrfessorpaws-40ca2.appspot.com/o/Profilephotos%2Fdefault-profile.png?alt=media&token=80695fdf-4059-4d7f-ad33-ed9c05386469', isVerified = false, isPhotoVerified = false, rejectionReason = '') {
      this.id = id;
      this.name = name;
      this.email = email;
      this.petDescription = petDescription;
      this.role = role;
      this.profileImage = profileImage;
      this.isVerified = isVerified;
      this.isPhotoVerified = isPhotoVerified;
      this.rejectionReason = rejectionReason;
    }
  
    toFirestore() {
      return {
        id: this.id,
        name: this.name,
        email: this.email,
        petDescription: this.petDescription,
        role: this.role,
        profileImage: this.profileImage,
        isVerified: this.isVerified,
        isPhotoVerified: this.isPhotoVerified,
        rejectionReason: this.rejectionReason,
      };
    }
  
    static fromFirestore(snapshot) {
      const data = snapshot.data();
      return new User(data.id, data.name, data.email, data.petDescription, data.role, data.profileImage, data.isVerified,data.isPhotoVerified, data.rejectionReason);
    }
  }
  
  module.exports = User;
  