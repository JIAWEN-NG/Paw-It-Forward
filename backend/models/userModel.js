// models/userModel.js

class User {
    constructor(id, name, email) {
      this.id = id;
      this.name = name;
      this.email = email;
    }
  
    toFirestore() {
      return {
        id: this.id,
        name: this.name,
        email: this.email
      };
    }
  
    static fromFirestore(snapshot) {
      const data = snapshot.data();
      return new User(data.id, data.name, data.email);
    }
  }
  
  module.exports = User;
  