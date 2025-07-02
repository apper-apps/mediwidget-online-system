import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <header className="bg-white border-b border-surface-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          
          <div>
            <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
            <p className="text-sm text-surface-600">
              Konfigurieren Sie Ihr Website-Widget
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Save Status */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="hidden sm:flex items-center space-x-2"
          >
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-surface-600">Automatisch gespeichert</span>
          </motion.div>

          {/* Widget Status */}
          <Badge variant="accent" className="hidden sm:inline-flex">
            Widget aktiv
          </Badge>

          {/* Preview Button */}
          <Button
            variant="outline"
            size="sm"
            icon="Eye"
            className="hidden md:inline-flex"
          >
            Vorschau
          </Button>

          {/* Help */}
          <Button
            variant="ghost"
            size="sm"
            icon="HelpCircle"
            className="text-surface-500 hover:text-primary-600"
          />
        </div>
      </div>
    </header>
  )
}

export default Header