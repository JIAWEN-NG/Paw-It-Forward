<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Edit Profile</h2>
      <form @submit.prevent="saveProfile">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" v-model="editableUser.name" id="name" required />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="editableUser.email" id="email" required />
        </div>
        
        <div class="form-group">
          <label for="petDescription">Pet Description</label>
          <textarea
            id="petDescription"
            v-model="editableUser.petDescription"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="modal-buttons">
          <button class="cancel-button" @click="close">Cancel</button>
          <button class="save-button" :disabled="!hasChanges" type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../main';

export default {
  name: 'EditProfileModal',
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      editableUser: {}, // Initialize as an empty object
      hasChanges: false
    };
  },
  mounted() {
    // Populate `editableUser` after the component has mounted to ensure `currentUser` has loaded
    this.editableUser = {
      id: this.userId || '', // Use userId prop here
      name: this.currentUser.name || '',
      email: this.currentUser.email || '',
      petDescription: this.currentUser.petDescription || ''
    };
  },
  watch: {
    editableUser: {
      handler() {
        this.hasChanges = JSON.stringify(this.editableUser) !== JSON.stringify(this.currentUser);
      },
      deep: true
    }
  },
  methods: {
    async saveProfile() {
      try {
        if (!this.editableUser.id) {
          console.error("User ID is missing. Cannot update profile.");
          return;
        }

        const userDocRef = doc(db, 'Users', this.editableUser.id);

        await updateDoc(userDocRef, {
          name: this.editableUser.name,
          email: this.editableUser.email,
          petDescription: this.editableUser.petDescription,
        });

        this.$emit('save', this.editableUser);
        this.$emit('showSuccess', 'Your profile has been updated successfully.');
        this.close();
      } catch (error) {
        console.error("Error updating profile:", error.message);
      }
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h2 {
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-button {
  background-color: transparent;
  color: #6c757d;
  padding: 6px 12px;
  border: 1px solid #6c757d;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.cancel-button:hover {
  background-color: #6c757d;
  color: white;
}

.save-button {
  background-color: #28a745;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #218838;
}

.save-button:disabled {
  background-color: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}
</style>
