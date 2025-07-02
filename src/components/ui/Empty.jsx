import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "Keine Daten verfügbar",
  description = "Es sind noch keine Daten vorhanden.",
  icon = "FileText",
  action,
  actionLabel = "Erste Einträge hinzufügen",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-surface-900 mb-3">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{actionLabel}</span>
        </button>
      )}
    </motion.div>
  )
}

export default Empty