import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

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