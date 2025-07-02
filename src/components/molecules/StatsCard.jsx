import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'primary',
  className = ''
}) => {
  const colorClasses = {
    primary: {
      icon: 'bg-primary-100 text-primary-600',
      trend: trend === 'up' ? 'text-accent-600' : 'text-red-600'
    },
    accent: {
      icon: 'bg-accent-100 text-accent-600',
      trend: trend === 'up' ? 'text-accent-600' : 'text-red-600'
    },
    warning: {
      icon: 'bg-yellow-100 text-yellow-600',
      trend: trend === 'up' ? 'text-accent-600' : 'text-red-600'
    },
    success: {
      icon: 'bg-green-100 text-green-600',
      trend: trend === 'up' ? 'text-accent-600' : 'text-red-600'
    }
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-600 mb-1">
            {title}
          </p>
          
          <motion.p
            className="text-2xl font-bold text-surface-900 mb-2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {value}
          </motion.p>
          
          {trend && trendValue && (
            <div className={`flex items-center text-sm ${colorClasses[color].trend}`}>
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
                className="mr-1"
              />
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color].icon}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  )
}

export default StatsCard