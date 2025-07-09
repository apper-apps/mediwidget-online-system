import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const Header = ({ onMenuClick, title, currentUser, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const handleSettingsClick = () => {
    setShowUserMenu(false)
    navigate('/settings')
  }

  const handleProfileClick = () => {
    setShowUserMenu(false)
    navigate('/practice-info')
  }

  const handleLogoutClick = () => {
    setShowUserMenu(false)
    onLogout()
  }

  return (
    <header className="bg-white border-b border-surface-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          
          <div>
            <h1 className="text-xl font-bold text-surface-900">{title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="success" size="sm">
                Widget Aktiv
              </Badge>
              <span className="text-xs text-surface-600">
                Letzte Aktualisierung: vor 2 Min
              </span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            icon="Bell"
            className="relative"
          >
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-50 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-surface-900">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Benutzer'}
                </p>
                <p className="text-xs text-surface-600">
                  {currentUser?.practiceName || 'Praxis'}
                </p>
              </div>
              <ApperIcon name="ChevronDown" size={16} className="text-surface-600" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white border border-surface-200 rounded-lg shadow-lg z-50"
                >
                  <div className="p-4 border-b border-surface-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-surface-900">
                          {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Benutzer'}
                        </p>
                        <p className="text-sm text-surface-600">
                          {currentUser?.email || 'keine E-Mail'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={handleSettingsClick}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-50 transition-colors text-left"
                    >
                      <ApperIcon name="Settings" size={18} className="text-surface-600" />
                      <span className="text-sm font-medium text-surface-900">Einstellungen</span>
                    </button>

                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-50 transition-colors text-left"
                    >
                      <ApperIcon name="Building2" size={18} className="text-surface-600" />
                      <span className="text-sm font-medium text-surface-900">Praxis-Profil</span>
                    </button>

                    <button
                      onClick={() => navigate('/analytics')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-50 transition-colors text-left"
                    >
                      <ApperIcon name="BarChart3" size={18} className="text-surface-600" />
                      <span className="text-sm font-medium text-surface-900">Analytics</span>
                    </button>

                    <div className="border-t border-surface-200 my-2"></div>

<button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left text-red-600"
                    >
                      <ApperIcon name="LogOut" size={18} />
                      <span className="text-sm font-medium">Abmelden</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header