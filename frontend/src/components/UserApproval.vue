<template>
    <div class="container-fluid px-5 py-4">
        <div class="container bg-white shadow-sm rounded p-4">
            <!-- User Table -->
            <div class="table-responsive">
                <table class="table table-hover align-middle text-center mb-0">
                    <thead class="table-header">
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                            <th scope="col">Status</th>
                            <th v-if="status === 'Rejected'" scope="col">Reason</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in paginatedUsers" :key="user.id">
                            <td>
                                <img :src="user.verificationPhoto" alt="User Image" class="shadow-sm user-image" />
                            </td>
                            <td class="fw-semibold">{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td><span class="badge bg-info text-white px-3 py-1 rounded-pill">{{ user.role }}</span>
                            </td>
                            <td>
                                <span :class="statusBadgeClass(getUserStatus(user))" class="px-3 py-1 rounded-pill">
                                    {{ getUserStatus(user) }}
                                </span>
                            </td>
                            <td v-if="status === 'Rejected'">{{ user.rejectionReason }}</td>
                            <td>
                                <div class="d-flex justify-content-center gap-2">
                                    <button v-if="status === 'Pending'" @click="openApproveModal(user)"
                                        class="btn btn-outline-success btn-sm fancy-btn">
                                        <i class="bi bi-check-circle me-1"></i> Approve
                                    </button>
                                    <button v-if="status === 'Pending'" @click="openRejectModal(user)"
                                        class="btn btn-outline-danger btn-sm fancy-btn">
                                        <i class="bi bi-x-circle me-1"></i> Reject
                                    </button>
                                    <button @click="openModal(user)" class="btn btn-outline-primary btn-sm fancy-btn">
                                        <i class="bi bi-eye me-1"></i> View
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Controls -->
            <nav class="mt-4">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
                    </li>
                    <li v-for="page in totalPages" :key="page" class="page-item"
                        :class="{ active: currentPage === page }">
                        <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- User Details Modal -->
        <div v-if="showViewModal" class="modal fade show" tabindex="-1"
            style="display: block; background-color: rgba(0, 0, 0, 0.5);" @click.self="closeModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0 d-flex justify-content-between align-items-center">
                        <h5 class="modal-title fw-bold">User Details</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body d-flex align-items-center">
                        <div class="me-4">
                            <img :src="selectedUser.verificationPhoto || 'path/to/default/image.jpg'" alt="User Image"
                                class="rounded shadow" style="width: 150px; height: 150px; object-fit: cover; ">
                        </div>

                        <div class="user-info">
                            <h5 class="fw-semibold">{{ selectedUser.name }}</h5>
                            <p><strong>Email:</strong> {{ selectedUser.email }}</p>
                            <p><strong>Role:</strong> {{ selectedUser.role }}</p>
                            <p><strong>Status:</strong> {{ selectedUser.status }}</p>
                            <p v-if="selectedUser.rejectionReason"><strong>Reason:</strong> {{
                                selectedUser.rejectionReason }}</p>
                        </div>
                    </div>
                    <div class="modal-footer border-0 d-flex justify-content-center">
                        <button type="button" class="btn btn-primary px-4 py-2" @click="closeModal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reject User Modal -->
        <div v-if="showRejectModal" class="modal fade show" tabindex="-1"
            style="display: block; background-color: rgba(0, 0, 0, 0.5);" @click.self="closeModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Reject User</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Provide a reason for rejecting {{ selectedUser.name }}:</p>
                        <textarea v-model="rejectionReason" class="form-control" rows="3"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="submitRejection">Reject</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Approve User Modal -->
        <div v-if="showApproveModal" class="modal fade show" tabindex="-1"
            style="display: block; background-color: rgba(0, 0, 0, 0.5);" @click.self="closeModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Approve User</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to approve {{ selectedUser.name }}?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                        <button type="button" class="btn btn-success" @click="confirmApproval">Approve</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        status: {
            type: String,
            required: true,
        },
        users: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    data() {
        return {
            currentPage: 1,
            itemsPerPage: 10,
            selectedUser: {},
            showViewModal: false,
            showRejectModal: false,
            showApproveModal: false,
            rejectionReason: '',
        };
    },
    computed: {
      
        paginatedUsers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.users.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.users.length / this.itemsPerPage);
        }
    },
    methods: {
        getUserStatus(user) {
            if (!user.isPhotoVerified && !user.remarks) {
                return 'Pending';
            } else if (!user.isPhotoVerified && user.remarks) {
                return 'Rejected';
            } else if (user.isPhotoVerified) {
                return 'Approved';
            }
        },
        statusBadgeClass(status) {
            return {
                'badge bg-warning text-dark': status === 'Pending',
                'badge bg-success text-white': status === 'Approved',
                'badge bg-danger text-white': status === 'Rejected'
            }[status];
        },
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        openModal(user) {
            this.selectedUser = user;
            this.showViewModal = true;
        },
        openRejectModal(user) {
            this.selectedUser = user;
            this.rejectionReason = '';
            this.showRejectModal = true;
        },
        openApproveModal(user) {
            this.selectedUser = user;
            this.showApproveModal = true;
        },
        closeModal() {
            this.showViewModal = false;
            this.showRejectModal = false;
            this.showApproveModal = false;
        },
        submitRejection() {
            this.$emit('reject', this.selectedUser.id, this.rejectionReason);
            this.rejectionReason = '';
            this.closeModal();
        },
        confirmApproval() {
            this.$emit('approve', this.selectedUser.id);
            this.closeModal();
        },
    }
};
</script>


<style scoped>
.admin-container {
    padding: 0 5vw 4vw;
}

.table-container {
    background-color: #ffffff;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 2rem;
}

.table-header {
    background-color: #f1f5f9;
}

.table th,
.table td {
    padding: 1rem;
    text-align: center;
    vertical-align: middle;
}

.user-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 10%;
    display: inline-block;
    vertical-align: middle;
}

.modal-user-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.status-badge {
    padding: 0.3em 0.6em;
    font-size: 0.875em;
    color: #ffffff;
    border-radius: 12px;
}

.status-badge-pending {
    background-color: #ffc107;
    color: #212529;
}

.status-badge-approved {
    background-color: #28a745;
}

.status-badge-rejected {
    background-color: #dc3545;
}

.btn-fancy {
    padding: 0.4rem 0.8rem;
    border-radius: 25px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-fancy:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
