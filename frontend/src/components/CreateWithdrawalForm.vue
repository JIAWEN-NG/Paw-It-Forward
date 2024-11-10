<template>
  <div class="modal-overlay">
    <div class="modal-dialog">
      <div class="modal-content">
        <span class="close" @click="$emit('close')">&times;</span>
        <h5 class="modal-title">Request Withdrawal</h5>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Form Fields -->
            <div class="form-group mb-3">
              <label for="accountNo" class="form-label">Account Number</label>
              <input type="text" id="accountNo" v-model="withdrawal.accountNo" required class="form-control" />
            </div>
            <div class="form-group mb-3">
              <label for="amountWithdraw" class="form-label">Amount to Withdraw ($)</label>
              <input type="number" id="amountWithdraw" v-model="withdrawal.amountWithdraw" required min="1" class="form-control" />
            </div>
            <div class="form-group mb-3">
              <label for="reason" class="form-label">Reason</label>
              <textarea id="reason" v-model="withdrawal.reason" required class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group mb-3">
              <label for="imageUpload" class="form-label">Upload Proof Image</label>
              <div class="image-upload-box" @click="triggerFileInput">
                <img v-if="imagePreview" :src="imagePreview" class="image-preview" />
                <span v-else class="text-muted">No Image Uploaded</span>
              </div>
              <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" ref="fileInput" style="display: none;" />
              <button type="button" @click="triggerFileInput" class="upload-button">{{ withdrawal.image ? 'Reupload' : 'Choose File' }}</button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="$emit
              ('close')">Cancel</button>
              <button type="submit" class="btn btn-success" :disabled="submitting">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { authState } from '@/store/auth';

export default {
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      submitting: false,
      withdrawal: {
        accountNo: '',
        amountWithdraw: null,
        postId: this.postId,
        reason: '',
        image: null,
      },
      imagePreview: ''
    };
  },
  methods: {
    async submitForm() {
      this.submitting = true;
      const formData = new FormData();
      formData.append('accountNo', this.withdrawal.accountNo);
      formData.append('amountWithdraw', this.withdrawal.amountWithdraw);
      formData.append('postId', this.withdrawal.postId);
      formData.append('reason', this.withdrawal.reason);
      if (this.withdrawal.image) formData.append('image', this.withdrawal.image);
      formData.append('userId', authState.userId); 

      try {
        const response = await fetch(`${this.$api_url}/withdrawals`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (response.ok) {
          this.$emit('withdrawalCreated', data);
          this.$emit('close');
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error creating withdrawal:', error);
        alert('Error creating withdrawal. Please try again.');
      } finally {
        this.submitting = false;
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.withdrawal.image = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  font-family: 'Montserrat', sans-serif;
}

.modal-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: 10px;
}

.modal-content {
  border-radius: 8px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: relative;
}

.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px;
}

.modal-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  display: block;
  text-align: left;
}

.form-control {
  border-radius: 5px;
  border: 1px solid #ced4da;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-control:focus {
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  border-color: #80bdff;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 15px;
}

.image-upload-box {
  width: 100%;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.image-upload-box:hover {
  border-color: #007bff;
}

.image-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.upload-button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width:35%;
}

.upload-button:hover {
  background-color: #2980b9;
}


</style>
