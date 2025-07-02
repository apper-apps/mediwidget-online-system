import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const NavigationItem = ({
  to,
  icon,
  label,
  badge,
  className = ''
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        nav-link group relative
        ${isActive ? 'active' : ''}
        ${className}
      `.trim()}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center flex-1">
            <ApperIcon 
              name={icon} 
              size={20} 
              className={`mr-3 transition-colors duration-200 ${
                isActive ? 'text-primary-600' : 'text-surface-500 group-hover:text-primary-600'
              }`}
            />
            <span className="font-medium">{label}</span>
          </div>
          
          {badge && (
            <span className="status-badge active text-xs">
              {badge}
            </span>
          )}
          
          {isActive && (
            <motion.div
              className="absolute right-0 w-1 h-8 bg-primary-500 rounded-l-full"
              layoutId="activeIndicator"
              transition={{ duration: 0.2 }}
            />
          )}
        </>
      )}
    </NavLink>
  )
}

export default NavigationItem