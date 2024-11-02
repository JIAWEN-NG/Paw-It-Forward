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
                <th scope="col">Email</th>
                <th scope="col">Description</th>
                <th scope="col">Request for Transfer Money</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in paginatedRequests" :key="request.id">
                <td class="fw-semibold">{{ request.receiverName }}</td>
                <td>{{ request.date }}</td>
                <td>{{ request.amount }}</td>
                <td>{{ request.email }}</td>
                <td>{{ request.description }}</td>
                <td>
                  <span v-if="request.requestForTransfer === 'YES'" class="text-success">YES</span>
                  <span v-else class="text-danger">NO</span>
                </td>
                <td>
                  <div class="d-flex justify-content-center gap-2">
                    <button @click="$emit('transfer', request.id)" class="btn btn-outline-success btn-sm fancy-btn">
                      <i class="bi bi-arrow-right-circle me-1"></i> Transfer
                    </button>
                    <button @click="$emit('reject', request.id)" class="btn btn-outline-danger btn-sm fancy-btn">
                      <i class="bi bi-x-circle me-1"></i> Reject
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
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="goToPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        requests: [
          { id: 1, receiverName: 'Theresa Webb', date: 'Feb 15, 2020', amount: '$3,500', email: 'abc@gmail.com', description: 'Help Sprinkler Operation Bill', requestForTransfer: 'YES' },
          { id: 2, receiverName: 'Darrell Steward', date: 'Feb 15, 2020', amount: '$1,800', email: 'abc@gmail.com', description: 'Help Sprinkler Operation Bill', requestForTransfer: 'YES' },
          { id: 3, receiverName: 'Marvin McKinney', date: 'Feb 15, 2020', amount: '$4,500', email: 'abc@gmail.com', description: 'Help Sprinkler Operation Bill', requestForTransfer: 'YES' },
          { id: 4, receiverName: 'Brooklyn Simmons', date: 'Feb 15, 2020', amount: '$1,000', email: 'abc@gmail.com', description: 'Help Sprinkler Operation Bill', requestForTransfer: 'YES' },
          { id: 5, receiverName: 'Wade Warren', date: 'Feb 15, 2020', amount: '$2,300', email: 'abc@gmail.com', description: 'Help Sprinkler Operation Bill', requestForTransfer: 'YES' },
        ],
        currentPage: 1,
        itemsPerPage: 5,
      };
    },
    computed: {
      paginatedRequests() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.requests.slice(start, end);
      },
      totalPages() {
        return Math.ceil(this.requests.length / this.itemsPerPage);
      },
    },
    methods: {
      goToPage(page) {
        if (page > 0 && page <= this.totalPages) {
          this.currentPage = page;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container-fluid {
    padding-left: 10vw;
    padding-right: 10vw;
  }
  .table-responsive {
    border-radius: 12px;
    background-color: #f8f9fa;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
  .table-header {
    background-color: #f1f5f9;
  }
  .table th, .table td {
    vertical-align: middle;
    padding: 1rem;
  }
  .table-hover tbody tr:hover {
    background-color: #f1f5f9;
  }
  .fancy-btn {
    transition: all 0.3s ease;
    padding: 0.4rem 0.8rem;
    border-radius: 25px;
  }
  .fancy-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  .badge {
    font-size: 0.875em;
    padding: 0.4em 0.6em;
    border-radius: 50px;
  }
  </style>
  