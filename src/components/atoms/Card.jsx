import React from 'react'
import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  hover = true,
  clickable = false,
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-surface-200 transition-all duration-200'
  const hoverClasses = hover ? 'hover:shadow-md' : ''
  const clickableClasses = clickable ? 'cursor-pointer hover:scale-[1.01]' : ''
  
  const cardClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`.trim()

  if (clickable) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

export default Card