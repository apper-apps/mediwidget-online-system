import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({
  placeholder = "Suchen...",
  onSearch,
  className = ''
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const clearSearch = () => {
    setQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon 
          name="Search" 
          size={16} 
          className={`transition-colors duration-200 ${
            isFocused ? 'text-primary-500' : 'text-surface-400'
          }`}
        />
      </div>
      
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full pl-10 pr-10 py-2.5 border rounded-lg transition-all duration-200
          ${isFocused 
            ? 'border-primary-500 ring-2 ring-primary-100' 
            : 'border-surface-300 hover:border-surface-400'
          }
          bg-white focus:outline-none
        `}
      />
      
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600 transition-colors duration-200"
        >
          <ApperIcon name="X" size={16} />
        </button>
      )}
    </motion.div>
  )
}

export default SearchBar