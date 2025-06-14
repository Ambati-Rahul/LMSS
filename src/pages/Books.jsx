import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, BookOpen, Eye } from 'lucide-react'
import { booksAPI } from '../services/api'
import toast from 'react-hot-toast'

const Books = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await booksAPI.getAll()
      setBooks(response.data)
    } catch (error) {
      console.error('Error fetching books:', error)
      toast.error('Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await booksAPI.delete(id)
        toast.success('Book deleted successfully')
        fetchBooks()
      } catch (error) {
        console.error('Error deleting book:', error)
        toast.error('Failed to delete book')
      }
    }
  }

  const handleViewDetails = (book) => {
    setSelectedBook(book)
    setShowModal(true)
  }

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Books</h1>
          <p className="text-gray-600 mt-1">Manage your library collection</p>
        </div>
        <Link to="/books/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Link>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, ISBN, or category..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="card hover:shadow-lg transition-all duration-200">
            <div className="card-body">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">by {book.author}</p>
                </div>
                <BookOpen className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{book.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ISBN:</span>
                  <span className="font-mono text-xs">{book.isbn}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className={`font-medium ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {book.available}/{book.quantity}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDetails(book)}
                  className="flex-1 btn-secondary text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>
                <Link
                  to={`/books/edit/${book.id}`}
                  className="flex-1 btn-secondary text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="flex-1 btn-danger text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first book'}
          </p>
          <Link to="/books/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Link>
        </div>
      )}

      {/* Book Details Modal */}
      {showModal && selectedBook && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)} />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Book Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="text-sm text-gray-900">{selectedBook.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Author</label>
                  <p className="text-sm text-gray-900">{selectedBook.author}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900">{selectedBook.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ISBN</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedBook.isbn}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Quantity</label>
                    <p className="text-sm text-gray-900">{selectedBook.quantity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Available</label>
                    <p className="text-sm text-gray-900">{selectedBook.available}</p>
                  </div>
                </div>
                {selectedBook.publishedYear && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Published Year</label>
                    <p className="text-sm text-gray-900">{selectedBook.publishedYear}</p>
                  </div>
                )}
                {selectedBook.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900">{selectedBook.description}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex space-x-3">
                <Link
                  to={`/books/edit/${selectedBook.id}`}
                  className="flex-1 btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  Edit Book
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Books