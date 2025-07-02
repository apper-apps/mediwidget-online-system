import React from 'react'
import Input from '@/components/atoms/Input'

const FormField = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  icon,
  options = [],
  rows = 3,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, name)
    }
  }

  if (type === 'select') {
    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-surface-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={handleChange}
            className={`
              form-select appearance-none
              ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            `}
            {...props}
          >
            <option value="">{placeholder || 'Auswählen...'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-surface-600">{helperText}</p>
        )}
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-surface-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={`
            form-textarea
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          `}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-surface-600">{helperText}</p>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <Input
        type={type}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        error={error}
        helperText={helperText}
        icon={icon}
        required={required}
        {...props}
      />
    </div>
  )
}

export default FormField