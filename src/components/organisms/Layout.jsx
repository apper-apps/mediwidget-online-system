import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'
import { authService } from '@/services/api/authService'
import { toast } from 'react-toastify'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.error('Error loading user:', error)
      }
    }
    loadUser()
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      toast.success('Erfolgreich abgemeldet')
      navigate('/login')
    } catch (error) {
      toast.error('Fehler beim Abmelden')
    }
  }
  const getPageTitle = () => {
    const titles = {
      '/': 'Dashboard',
      '/widget-settings': 'Widget-Einstellungen',
      '/practice-info': 'Praxis-Informationen',
      '/opening-hours': 'Öffnungszeiten',
      '/callback-setup': 'Rückruf-Setup',
      '/chatbot-builder': 'Chatbot-Builder',
      '/analytics': 'Analytics',
      '/embed-install': 'Einbetten & Installation'
    }
    return titles[location.pathname] || 'Dashboard'
  }

  return (
    <div className="min-h-screen bg-surface-100 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
<Header 
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle()}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout