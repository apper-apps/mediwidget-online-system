import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Loading from '@/components/ui/Loading'
import { authService } from '@/services/api/authService'

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
        setIsAuthenticated(!!user)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-100 flex items-center justify-center">
        <Loading type="page" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute