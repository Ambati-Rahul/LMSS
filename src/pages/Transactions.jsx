import React, { useState, useEffect } from 'react'
import { Search, ArrowRightLeft, Calendar, User, BookOpen, Plus } from 'lucide-react'
import { transactionsAPI, usersAPI, booksAPI } from '../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [issueForm, setIssueForm] = useState({
    userId: '',
    bookId: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersResponse, booksResponse] = await Promise.all([
        usersAPI.getAll(),
        booksAPI.getAll()
      ])
      
      setUsers(usersResponse.data)
      setBooks(booksResponse.data)
      
      // Fetch all user transactions
      const allTransactions = []
      for (const user of usersResponse.data) {
        try {
          const userTransactions = await transactionsAPI.getUserTransactions(user.id)
          allTransactions.push(...userTransactions.data)
        } catch (error) {
          console.error(`Error fetching transactions for user ${user.id}:`, error)
        }
      }
      
      setTransactions(allTransactions)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleIssueBook = async (e) => {
    e.preventDefault()
    
    if (!issueForm.userId || !issueForm.bookId) {
      toast.error('Please select both user and book')
      return
    }

    try {
      await transactionsAPI.issueBook(issueForm.userId, issueForm.bookId)
      toast.success('Book issued successfully')
      setShowIssueModal(false)
      setIssueForm({ userId: '', bookId: '' })
      fetchData()
    } catch (error) {
      console.error('Error issuing book:', error)
      toast.error(error.response?.data || 'Failed to issue book')
    }
  }

  const handleReturnBook = async (transactionId) => {
    if (window.confirm('Are you sure you want to return this book?')) {
      try {
        await transactionsAPI.returnBook(transactionId)
        toast.success('Book returned successfully')
        fetchData()
      } catch (error) {
        console.error('Error returning book:', error)
        toast.error(error.response?.data || 'Failed to return book')
      }
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'issued':
        return 'badge-warning'
      case 'returned':
        return 'badge-success'
      case 'overdue':
        return 'badge-danger'
      default:
        return 'badge-info'
    }
  }

  const filteredTransactions = transactions.filter(transaction =>
    transaction.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.bookIsbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Manage book issues and returns</p>
        </div>
        <button
          onClick={() => setShowIssueModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Issue Book
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions by user, book title, ISBN, or status..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {transaction.userId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.bookTitle}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          {transaction.bookIsbn}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {transaction.issueDate ? format(new Date(transaction.issueDate), 'MMM dd, yyyy') : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {transaction.dueDate ? format(new Date(transaction.dueDate), 'MMM dd, yyyy') : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.returnDate ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {format(new Date(transaction.returnDate), 'MMM dd, yyyy')}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not returned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadge(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.fine && parseFloat(transaction.fine) > 0 ? (
                      <span className="text-red-600 font-medium">
                        ${parseFloat(transaction.fine).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-400">$0.00</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {transaction.status === 'ISSUED' && (
                      <button
                        onClick={() => handleReturnBook(transaction.id)}
                        className="btn-success text-xs"
                      >
                        Return Book
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <ArrowRightLeft className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'No transactions have been recorded yet'}
            </p>
            <button
              onClick={() => setShowIssueModal(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Issue First Book
            </button>
          </div>
        )}
      </div>

      {/* Issue Book Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowIssueModal(false)} />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Issue Book</h3>
                <button
                  onClick={() => setShowIssueModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleIssueBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    value={issueForm.userId}
                    onChange={(e) => setIssueForm(prev => ({ ...prev, userId: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="">Choose a user</option>
                    {users.filter(user => user.status === 'Active').map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.membershipId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Book
                  </label>
                  <select
                    value={issueForm.bookId}
                    onChange={(e) => setIssueForm(prev => ({ ...prev, bookId: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="">Choose a book</option>
                    {books.filter(book => book.available > 0).map(book => (
                      <option key={book.id} value={book.id}>
                        {book.title} by {book.author} (Available: {book.available})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Issue Book
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions