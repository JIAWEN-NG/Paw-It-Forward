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
              <th scope="col">Proof</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in sortedRequests" :key="request.id">
              <td class="fw-semibold">{{ request.name }}</td>
              <td>{{ formatDate(request.requestedAt) }}</td>
              <td>{{ "$" + request.amountWithdraw }}</td>
              <td>{{ request.reason.length > 10 ? request.reason.slice(0, 10) + '...' : request.reason }}</td>
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
              <td v-if="request.status === 'Pending'">
                <div class="d-flex justify-content-center gap-2">
                  <button @click="openTransferModal(request)" class="btn btn-outline-success btn-sm fancy-btn">
                    <i class="bi bi-arrow-right-circle me-1"></i> Transfer
                  </button>
                  <button @click="openRejectModal(request)" class="btn btn-outline-danger btn-sm fancy-btn">
                    <i class="bi bi-x-circle me-1"></i> Reject
                  </button>
                  <button @click="viewRequestDetails(request)" class="btn btn-outline-primary btn-sm fancy-btn">
                    <i class="bi bi-eye me-1"></i> Details
                  </button>
                </div>
              </td>
              <td v-else>-</td>
            </tr>
          </tbody>
        </table>
      </div>


      <!-- Proof Image Modal -->
      <div v-if="showModal" class="modal fade show" @click.self="closeModal">
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
      <div v-if="showTransferModal" class="modal fade show" @click.self="closeTransferModal">
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

      <!-- Reject Withdrawal Modal -->
      <div v-if="showRejectModal" class="modal fade show" @click.self="closeRejectModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Reject Withdrawal</h5>
              <button type="button" class="btn-close" @click="closeRejectModal"></button>
            </div>
            <div class="modal-body">
              <p>Provide a reason for rejecting <b>@{{ selectedRequest.name }}</b>:</p>
              <textarea v-model="rejectionReason" class="form-control" rows="3"></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeRejectModal">Cancel</button>
              <button type="button" class="btn btn-danger" @click="submitRejection">Reject</button>
            </div>
          </div>
        </div>
      </div>
      <!-- View Request Details Modal -->
      <div v-if="showViewRequestModal" class="modal fade show custom-modal" tabindex="-1"
        style="display: block; background-color: rgba(0, 0, 0, 0.5);" @click.self="closeViewRequestModal">
        <div class="modal-dialog modal-dialog-centered custom-modal-dialog">
          <div class="modal-content">
            <div class="modal-header border-0 d-flex justify-content-between align-items-center">
              <h5 class="modal-title fw-bold">Request Details</h5>
              <button type="button" class="btn-close" @click="closeViewRequestModal"></button>
            </div>
            <div class="modal-body d-flex align-items-start">
              <div class="modal-image-container">
                <img :src="selectedRequest?.proofImg || 'path/to/default/image.jpg'" alt="Request Image"
                  class="request-image">
              </div>

              <div class="request-info ms-4">
                <h5 class="details-title">Details</h5>
                <p><strong>Receiver Name:</strong> {{ selectedRequest?.name }}</p>
                <p><strong>Date:</strong> {{ formatDate(selectedRequest?.requestedAt) }}</p>
                <p><strong>Amount:</strong> ${{ selectedRequest?.amountWithdraw }}</p>
                <p><strong>Reason:</strong> {{ selectedRequest?.reason }}</p>
                <p><strong>Status:</strong> {{ selectedRequest?.status }}</p>
              </div>
            </div>
            <div class="modal-footer border-0 d-flex justify-content-center">
              <button type="button" class="btn btn-primary px-4 py-2" @click="closeViewRequestModal">Close</button>
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
      showTransferModal: false,
      selectedRequest: null,
      rejectionReason: '',
      showRejectModal: false,
      showViewRequestModal: false,
    };
  },
  computed: {
    sortedRequests() {
      return this.requests
        .slice()
        .sort((a, b) => {
          // Sort by date (newest first)
          const dateA = new Date(a.requestedAt._seconds * 1000);
          const dateB = new Date(b.requestedAt._seconds * 1000);
          if (dateA < dateB) return 1;
          if (dateA > dateB) return -1;

          // Sort by status (Pending first, then Approved, then Rejected)
          const statusOrder = { Pending: 1, Approved: 2, Rejected: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        });
    },
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
    openRejectModal(request) {
      this.selectedRequest = request;
      this.rejectionReason = '';
      this.showRejectModal = true;
    },
    closeRejectModal() {
      this.showRejectModal = false;
      this.rejectionReason = '';
    },
    submitRejection() {
      this.$emit('reject', this.selectedRequest.id, this.rejectionReason);
      this.closeRejectModal();
    },
    // New methods for viewing request details
    viewRequestDetails(request) {
      this.selectedRequest = request;
      this.showViewRequestModal = true;
    },
    closeViewRequestModal() {
      this.showViewRequestModal = false;
      this.selectedRequest = null;
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

/* Modal Styles */
.modal.fade.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.custom-modal-dialog {
  max-width: 800px;
  width: 90%;
  /* Make sure the modal is responsive */
}

.modal-body {
  padding: 2rem;
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1rem;
}

.modal-footer {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

/* Image Container Styles */
.modal-image-container {
  flex-shrink: 0;
  width: 250px;
  height: 250px;
  /* Fixed size for images to keep it consistent */
}

.request-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Request Info Styles */
.request-info {
  font-size: 1rem;
  line-height: 1.6;
}

.details-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.request-info p {
  margin: 0.5rem 0;
}

.request-info p strong {
  color: #555;
}


.modal-footer button {
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
}

/* General Layout Styling for Modal Content */
.modal-body.d-flex.align-items-start {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.ms-4 {
  margin-left: 1.5rem !important;
}
</style>
