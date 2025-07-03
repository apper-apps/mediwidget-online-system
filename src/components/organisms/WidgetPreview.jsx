import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { openingHoursService } from "@/services/api/openingHoursService";

const WidgetPreview = ({ 
  practiceInfo = {},
  openingHours: propOpeningHours = [],
  showChatbot = true,
  showCallback = true,
  showAppointment = true,
  size = 'desktop',
  launcherMode = false,
  launcherText = 'Online Rezeption'
}) => {
  const [openingHours, setOpeningHours] = useState(propOpeningHours)
  const [isLauncherOpen, setIsLauncherOpen] = useState(false)

  const {
    name = 'Dr. Muster Praxis',
    primaryColor = '#0066CC',
    secondaryColor = '#E8F2FF',
    logo
  } = practiceInfo

  useEffect(() => {
    const loadOpeningHours = async () => {
      if (propOpeningHours.length === 0) {
        try {
          const hours = await openingHoursService.getAll()
          setOpeningHours(hours)
        } catch (error) {
          console.error('Error loading opening hours:', error)
        }
      } else {
        setOpeningHours(propOpeningHours)
      }
    }
    loadOpeningHours()
  }, [propOpeningHours])

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
  if (launcherMode && !isLauncherOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsLauncherOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-200 z-50"
        style={{ backgroundColor: primaryColor }}
      >
        <ApperIcon name="MessageCircle" size={20} />
        <span className="font-medium">{launcherText}</span>
      </motion.button>
    )
  }

return (
    <motion.div
      initial={{ opacity: 0, y: launcherMode ? 100 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={launcherMode ? { opacity: 0, y: 100 } : undefined}
      transition={{ duration: 0.5 }}
      className={`${containerClasses} bg-white rounded-lg shadow-lg overflow-hidden ${launcherMode ? 'fixed bottom-20 right-6 z-50' : ''}`}
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
        
        <button 
          onClick={() => launcherMode && setIsLauncherOpen(false)}
          className="p-1.5 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
        >
          <ApperIcon name={launcherMode ? "X" : "Minimize2"} size={16} className="text-surface-600" />
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