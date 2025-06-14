import React, { useState, useEffect } from 'react'
import { BookOpen, Users, ArrowRightLeft, TrendingUp } from 'lucide-react'
import { booksAPI, usersAPI } from '../services/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    overdueBooks: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [booksResponse, usersResponse] = await Promise.all([
        booksAPI.getAll(),
        usersAPI.getAll()
      ])

      const books = booksResponse.data
      const users = usersResponse.data

      const totalBooks = books.reduce((sum, book) => sum + (book.quantity || 0), 0)
      const availableBooks = books.reduce((sum, book) => sum + (book.available || 0), 0)
      const activeUsers = users.filter(user => user.status === 'Active').length

      setStats({
        totalBooks,
        availableBooks,
        totalUsers: users.length,
        activeUsers,
        totalTransactions: users.reduce((sum, user) => sum + (user.booksIssued || 0), 0),
        overdueBooks: 0 // This would need additional API endpoint
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Available Books',
      value: stats.availableBooks,
      icon: BookOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Users,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      title: 'Books Issued',
      value: stats.totalTransactions,
      icon: ArrowRightLeft,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Overdue Books',
      value: stats.overdueBooks,
      icon: TrendingUp,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ]

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to Book Beacon Library Management System</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card hover:shadow-lg transition-all duration-200">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="card-body space-y-3">
            <button className="w-full btn-primary justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Add New Book
            </button>
            <button className="w-full btn-secondary justify-start">
              <Users className="h-4 w-4 mr-2" />
              Register New User
            </button>
            <button className="w-full btn-secondary justify-start">
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Issue Book
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="card-body">
            <div className="text-center text-gray-500 py-8">
              <ArrowRightLeft className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity to display</p>
              <p className="text-sm">Transaction history will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard