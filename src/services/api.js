import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// Books API
export const booksAPI = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  getByIsbn: (isbn) => api.get(`/books/isbn/${isbn}`),
  create: (book) => api.post('/books', book),
  update: (id, book) => api.put(`/books/${id}`, book),
  delete: (id) => api.delete(`/books/${id}`),
}

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  getByMembershipId: (membershipId) => api.get(`/users/membership/${membershipId}`),
  create: (user) => api.post('/users', user),
  update: (id, user) => api.put(`/users/${id}`, user),
  delete: (id) => api.delete(`/users/${id}`),
}

// Transactions API
export const transactionsAPI = {
  issueBook: (userId, bookId) => api.post(`/transactions/issue?userId=${userId}&bookId=${bookId}`),
  returnBook: (transactionId) => api.post(`/transactions/return/${transactionId}`),
  getUserTransactions: (userId) => api.get(`/transactions/user/${userId}`),
  getBookTransactions: (bookId) => api.get(`/transactions/book/${bookId}`),
}

export default api