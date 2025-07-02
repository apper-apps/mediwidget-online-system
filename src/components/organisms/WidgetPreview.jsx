import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const WidgetPreview = ({ 
  practiceInfo = {},
  openingHours = [],
  showChatbot = true,
  showCallback = true,
  showAppointment = true,
  size = 'desktop' 
}) => {
  const {
    name = 'Dr. Muster Praxis',
    primaryColor = '#0066CC',
    secondaryColor = '#E8F2FF',
    logo
  } = practiceInfo

  const getCurrentStatus = () => {
    const now = new Date()
    const today = now.getDay()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const todayHours = openingHours.find(h => h.dayOfWeek === today)
    
    if (!todayHours || todayHours.isClosed) {
      return { isOpen: false, message: 'Geschlossen' }
    }
    
    const [openHour, openMin] = todayHours.openTime.split(':').map(Number)
    const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number)
    const openTime = openHour * 60 + openMin
    const closeTime = closeHour * 60 + closeMin
    
    if (currentTime >= openTime && currentTime <= closeTime) {
      return { isOpen: true, message: `Geöffnet bis ${todayHours.closeTime}` }
    }
    
    return { isOpen: false, message: `Öffnet um ${todayHours.openTime}` }
  }

  const status = getCurrentStatus()

  const previewStyles = {
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
  }

  const containerClasses = size === 'mobile' 
    ? 'w-80 max-w-sm' 
    : 'w-96 max-w-md'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`widget-preview ${containerClasses}`}
      style={previewStyles}
    >
      {/* Widget Header */}
      <div className="widget-header" style={{ backgroundColor: secondaryColor }}>
        <div className="flex items-center space-x-3">
          {logo && (
            <img 
              src={logo} 
              alt={name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold text-surface-900">{name}</h3>
            <div className="flex items-center space-x-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-accent-500' : 'bg-surface-400'}`}></div>
              <span className={status.isOpen ? 'text-accent-700' : 'text-surface-600'}>
                {status.message}
              </span>
            </div>
          </div>
        </div>
        
        <button className="p-1.5 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors">
          <ApperIcon name="Minimize2" size={16} className="text-surface-600" />
        </button>
      </div>

      {/* Widget Content */}
      <div className="widget-content">
        {/* Chatbot Section */}
        {showChatbot && (
          <div className="widget-chat">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <ApperIcon name="MessageCircle" size={12} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-surface-800 text-sm">
                  Hallo! Wie kann ich Ihnen helfen?
                </p>
                <div className="mt-2 space-y-1">
                  <button className="text-xs text-primary-600 hover:text-primary-700 block">
                    📅 Termin vereinbaren
                  </button>
                  <button className="text-xs text-primary-600 hover:text-primary-700 block">
                    📞 Rückruf anfordern
                  </button>
                  <button className="text-xs text-primary-600 hover:text-primary-700 block">
                    ℹ️ Praxis-Informationen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Opening Hours */}
        <div className="widget-hours">
          <h4 className="font-medium text-surface-900 mb-2 text-sm">Öffnungszeiten</h4>
          <div className="space-y-1 text-xs">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr'].map((day, index) => {
              const hours = openingHours.find(h => h.dayOfWeek === index + 1)
              return (
                <div key={day} className="flex justify-between">
                  <span>{day}:</span>
                  <span>
                    {hours && !hours.isClosed 
                      ? `${hours.openTime} - ${hours.closeTime}`
                      : 'Geschlossen'
                    }
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {showAppointment && (
            <button 
              className="widget-button primary w-full"
              style={{ backgroundColor: primaryColor }}
            >
              <ApperIcon name="Calendar" size={16} className="mr-2" />
              Termin vereinbaren
            </button>
          )}
          
          {showCallback && (
            <button className="widget-button secondary w-full">
              <ApperIcon name="Phone" size={16} className="mr-2" />
              Rückruf anfordern
            </button>
          )}
        </div>
      </div>

      {/* Powered by */}
      <div className="px-4 py-2 border-t border-surface-200 text-center">
        <p className="text-xs text-surface-500">
          Powered by <span className="font-medium text-primary-600">MediWidget Pro</span>
        </p>
      </div>
    </motion.div>
  )
}

export default WidgetPreview