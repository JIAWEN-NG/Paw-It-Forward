<template>
  <div class="container-fluid px-5 py-4">
    <div class="container bg-white shadow-sm rounded p-4">
      <h2 class="mb-4">Donations</h2>
      <!-- Donation Table -->
      <div class="table-responsive">
        <table class="table table-hover align-middle text-center mb-0">
          <thead class="table-header">
            <tr>
              <th scope="col">Receiver Name</th>
              <th scope="col">Date</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Reason</th>
              <th scope="col">Status</th>
              <th scope="col">Proof</th> <!-- New Proof Column -->
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in requests" :key="request.id">
              <td class="fw-semibold">{{ request.name }}</td>
              <td>{{ formatDate(request.requestedAt) }}</td>
              <td>{{ "$" + request.amountWithdraw }}</td>
              <td>{{ request.reason }}</td>
              <td>
                <span v-if="request.status === 'Pending'" class="text-warning">Pending</span>
                <span v-else-if="request.status === 'Approved'" class="text-success">Approved</span>
                <span v-else class="text-danger">Rejected</span>
              </td>
              <td>
                <button @click="viewProof(request.proofImg)" class="btn btn-outline-primary btn-sm">
                  <i class="fa fa-eye"></i>
                </button>
              </td>
              <td>
                <div class="d-flex justify-content-center gap-2">
                  <button @click="openTransferModal(request)" class="btn btn-outline-success btn-sm fancy-btn">
                    <i class="bi bi-arrow-right-circle me-1"></i> Transfer
                  </button>
                  <button @click="openRejectModal(request.id)" class="btn btn-outline-danger btn-sm fancy-btn">
                    <i class="bi bi-x-circle me-1"></i> Reject
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal for Viewing Proof Image -->
      <div v-if="showModal" class="modal fade show" style="display: block; background-color: rgba(0, 0, 0, 0.5);" @click.self="closeModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Proof Image</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body d-flex justify-content-center">
              <img :src="currentProofImage" alt="Proof Image" class="img-fluid" />
            </div>
          </div>
        </div>
      </div>

      <!-- Transfer Confirmation Modal -->
      <div v-if="showTransferModal" class="modal fade show" style="display: block; background-color: rgba(0, 0, 0, 0.5);" @click.self="closeTransferModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Transfer</h5>
              <button type="button" class="btn-close" @click="closeTransferModal"></button>
            </div>
            <div class="modal-body">
              <p><strong>Receiver Name:</strong> {{ selectedRequest.name }}</p>
              <p><strong>Date:</strong> {{ formatDate(selectedRequest.requestedAt) }}</p>
              <p><strong>Amount:</strong> ${{ selectedRequest.amountWithdraw }}</p>
              <p><strong>Reason:</strong> {{ selectedRequest.reason }}</p>
              <p><strong>Status:</strong> {{ selectedRequest.status }}</p>
              <p>Are you sure you want to transfer this amount?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeTransferModal">Cancel</button>
              <button type="button" class="btn btn-success" @click="confirmTransfer">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    requests: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      currentProofImage: '',
      showTransferModal: false, // Controls visibility of the Transfer Modal
      selectedRequest: null, // Stores the selected request for transfer
    };
  },
  methods: {
    formatDate(timestamp) {
      if (timestamp && timestamp._seconds) {
        const date = new Date(timestamp._seconds * 1000);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      return '';
    },
    viewProof(proofImgUrl) {
      this.currentProofImage = proofImgUrl;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.currentProofImage = '';
    },
    openTransferModal(request) {
      this.selectedRequest = request;
      this.showTransferModal = true;
    },
    closeTransferModal() {
      this.showTransferModal = false;
      this.selectedRequest = null;
    },
    confirmTransfer() {
      if (this.selectedRequest) {
        this.$emit('transfer', this.selectedRequest.id);
        this.closeTransferModal();
      }
    },
  },
};
</script>

<style scoped>
.modal.fade.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}
.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>
