import React from 'react'

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-surface-100 text-surface-800',
    primary: 'bg-primary-100 text-primary-800',
    accent: 'bg-accent-100 text-accent-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }
  
  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`.trim()

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  )
}

export default Badge