import React from 'react'
import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'dashboard') {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-surface-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        
        {/* Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-surface-200 rounded"></div>
          </div>
          <div className="card p-6">
            <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 bg-surface-200 rounded w-24"></div>
                  <div className="h-4 bg-surface-200 rounded flex-1"></div>
                  <div className="h-4 bg-surface-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'form') {
    return (
      <div className="space-y-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-surface-200 rounded w-1/4"></div>
            <div className="h-12 bg-surface-200 rounded"></div>
          </div>
        ))}
        <div className="pt-4">
          <div className="h-12 bg-surface-200 rounded w-32"></div>
        </div>
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-surface-200">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-surface-200 rounded"></div>
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 py-3">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-4 bg-surface-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-12">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-primary-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default Loading