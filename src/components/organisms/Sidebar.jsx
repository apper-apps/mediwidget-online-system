import React from 'react'
import { motion } from 'framer-motion'
import NavigationItem from '@/components/molecules/NavigationItem'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
const navigationItems = [
    { to: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    { to: '/settings', icon: 'Settings', label: 'Einstellungen' },
    { to: '/widget-settings', icon: 'Sliders3', label: 'Widget-Einstellungen' },
    { to: '/practice-info', icon: 'Building2', label: 'Praxis-Informationen' },
    { to: '/opening-hours', icon: 'Clock', label: 'Öffnungszeiten' },
    { to: '/callback-setup', icon: 'Phone', label: 'Rückruf-Setup' },
    { to: '/chatbot-builder', icon: 'MessageSquare', label: 'Chatbot-Builder' },
    { to: '/analytics', icon: 'BarChart3', label: 'Analytics' },
    { to: '/embed-install', icon: 'Code', label: 'Einbetten & Installation' }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="lg:translate-x-0 lg:static fixed left-0 top-0 h-full w-72 bg-white border-r border-surface-200 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Stethoscope" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-surface-900">MediWidget Pro</h1>
              <p className="text-xs text-surface-600">Widget-Plattform</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-surface-500" />
          </button>
        </div>
{/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.slice(0, 2).map((item) => (
            <NavigationItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
            />
          ))}
          
          {/* Quick Settings Section */}
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-semibold text-surface-500 uppercase tracking-wider">
              Schnellzugriff
            </div>
            <div className="space-y-1">
              {navigationItems.slice(2).map((item) => (
                <NavigationItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  compact
                />
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-surface-200">
          <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
            <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">
                Dr. Muster Praxis
              </p>
              <p className="text-xs text-surface-600 truncate">
                Aktives Widget
              </p>
            </div>
            <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar