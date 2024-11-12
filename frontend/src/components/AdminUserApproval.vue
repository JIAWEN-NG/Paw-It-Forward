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
                                <img :src="user.verificationPhoto" alt="User Image" 
                                    class=" shadow-sm user-image fixed-size" />
                            </td>
                            <td class="fw-semibold">{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td><span class="badge bg-info text-white px-3 py-1 fs-7">{{ user.role }}</span></td>
                            <td>
                                <span :class="statusBadgeClass(getUserStatus(user))">
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
        <div v-if="showViewModal" class="modal fade show custom-modal" tabindex="-1"
            style="display: block; background-color: rgba(0, 0, 0, 0.5);" @click.self="closeModal">
            <div class="modal-dialog modal-dialog-centered custom-modal-dialog">
                <div class="modal-content">
                    <div class="modal-header border-0 d-flex justify-content-between align-items-center">
                        <h5 class="modal-title fw-bold">User Details</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <!-- Add Row Class Here -->
                    <div class="modal-body row">
                        <!-- Image container - takes 6 columns on MD+ -->
                        <div class="col-12 col-md-6 d-flex justify-content-center align-items-center mb-3 mb-md-0">
                            <div class="modal-image-container w-100">
                                <img :src="selectedUser.verificationPhoto || 'path/to/default/image.jpg'"
                                    alt="User Image" class="user-image-view img-fluid">
                            </div>
                        </div>

                        <!-- Details container - takes 6 columns on MD+ -->
                        <div class="col-12 col-md-6 user-info">
                            <h5 class="details-title">Details</h5>
                            <p><strong>Name:</strong> {{ selectedUser.name }}</p>
                            <p><strong>Email:</strong> {{ selectedUser.email }}</p>
                            <p><strong>Role:</strong> {{ selectedUser.role }}</p>
                            <p v-if="selectedUser.rejectionReason"><strong>Rejected Reason:</strong> {{
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
                        <p>Provide a reason for rejecting <b>@{{ selectedUser.name }}</b>:</p>
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
                        <p>Are you sure you want to approve <b>@{{ selectedUser.name }}</b>?</p>
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
            if (!user.isPhotoVerified && !user.rejectionReason) {
                return 'Pending';
            } else if (!user.isPhotoVerified && user.rejectionReason) {
                return 'Rejected';
            } else if (user.isPhotoVerified) {
                return 'Approved';
            }
        },
        statusBadgeClass(status) {
            switch (status) {
                case 'Pending':
                    return 'badge text-warning fs-6 fw-normal'; // Yellow badge
                case 'Approved':
                    return 'badge text-success fs-6 fw-normal'; // Green badge
                case 'Rejected':
                    return 'badge text-danger fs-6 fw-normal'; // Red badge
                default:
                    return 'badge text-white fs-6 fw-normal'; // Default badge if status is unknown
            }
        },
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        openModal(user) {
            this.selectedUser = user;
            this.showViewModal = true;
            this.$emit('view', user.id); // Emit the view event
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

table img.user-image.fixed-size {
    width: 80px !important;
    height: 80px !important;
    max-width: 80px !important;
    object-fit: cover;
    border-radius: 10%;
    display: inline-block;
    vertical-align: middle;
}

.modal-body {
    padding: 2rem;
}

.img-fluid {
    max-width: 100%;
    height: auto;
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


/* Larger modal dialog */
.custom-modal-dialog {
    margin: 0 auto;
    /* Centers the modal horizontally */
    transform: translateY(0);
    max-width: 700px;
    width: 90%;
}

.modal-image-container {
    width: 100%;
    height: auto;
}

/* Image styling */
.user-image-view {
    width: 500px;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* User info styling */
.user-info p {
    margin: 0.5rem 0;
}

.user-info {
    font-size: 1rem;
    line-height: 1.6;
}

.details-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #333;
}


.user-info p strong {
    color: #555;
}

@media (max-width: 576px) {

    /* Stack image and details vertically on extra-small screens */
    .modal-body {
        display: block;

    }

    .modal-image-container {
        margin-bottom: 1rem;
        width: 100%;
    }

    .request-info p {
        font-size: 0.9rem;
    }

    .modal-footer button {
        padding: 0.5rem 1.2rem;
        font-size: 0.9rem;
    }
}
</style>
