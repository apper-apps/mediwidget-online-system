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
        className="fixed bottom-6 right-6 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-200 z-50 hover:shadow-xl"
        style={{ 
          backgroundColor: primaryColor || '#0066CC',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <ApperIcon name="MessageCircle" size={20} />
        <span className="font-medium text-sm">{launcherText}</span>
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
      <div className="widget-header bg-white border-b border-surface-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {logo ? (
              <img 
                src={logo} 
                alt={name}
                className="w-10 h-10 rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <ApperIcon name="Stethoscope" size={18} className="text-white" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-surface-900 text-sm">{name}</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-green-400' : 'bg-surface-300'}`}></div>
                <span className={`text-xs font-medium ${status.isOpen ? 'text-green-600' : 'text-surface-500'}`}>
                  {status.isOpen ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => launcherMode && setIsLauncherOpen(false)}
            className="p-2 hover:bg-surface-50 rounded-full transition-colors duration-200"
          >
            <ApperIcon name={launcherMode ? "X" : "Minimize2"} size={16} className="text-surface-400" />
          </button>
        </div>
      </div>

{/* Widget Content */}
      <div className="widget-content px-5 py-4 space-y-4">
        {/* Chatbot Section */}
        {showChatbot && (
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                <ApperIcon name="MessageCircle" size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-surface-50 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                  <p className="text-surface-800 text-sm leading-relaxed">
                    Hallo! Wie kann ich Ihnen heute helfen?
                  </p>
                </div>
                <p className="text-xs text-surface-400 mt-1 ml-1">Gerade eben</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-2 max-w-xs">
                <button className="px-3 py-2 bg-white border border-surface-200 hover:border-primary-300 rounded-full text-xs font-medium text-surface-700 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1">
                  <ApperIcon name="Calendar" size={12} />
                  <span>Termin vereinbaren</span>
                </button>
                <button className="px-3 py-2 bg-white border border-surface-200 hover:border-primary-300 rounded-full text-xs font-medium text-surface-700 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1">
                  <ApperIcon name="Phone" size={12} />
                  <span>Rückruf anfordern</span>
                </button>
                <button className="px-3 py-2 bg-white border border-surface-200 hover:border-primary-300 rounded-full text-xs font-medium text-surface-700 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1">
                  <ApperIcon name="Info" size={12} />
                  <span>Informationen</span>
                </button>
              </div>
            </div>
          </div>
        )}

{/* Opening Hours */}
        <div className="widget-hours">
          <h4 className="font-semibold text-surface-900 mb-3 text-sm">Öffnungszeiten</h4>
          <div className="bg-surface-50 rounded-xl p-3 space-y-2">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr'].map((day, index) => {
              const hours = openingHours.find(h => h.dayOfWeek === index + 1)
              const isToday = new Date().getDay() === (index + 1) % 7
              return (
                <div key={day} className={`flex justify-between items-center text-xs ${isToday ? 'font-semibold text-primary-600' : 'text-surface-600'}`}>
                  <span className="flex items-center space-x-2">
                    {isToday && <div className="w-2 h-2 bg-primary-500 rounded-full"></div>}
                    <span>{day}:</span>
                  </span>
                  <span className={isToday ? 'text-primary-600' : 'text-surface-700'}>
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
        <div className="space-y-3 pt-2">
          {showAppointment && (
            <button 
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center space-x-2"
              style={{ backgroundColor: primaryColor || '#0066CC' }}
            >
              <ApperIcon name="Calendar" size={16} />
              <span>Termin vereinbaren</span>
            </button>
          )}
          
          {showCallback && (
            <button className="w-full py-3 px-4 bg-surface-100 hover:bg-surface-200 text-surface-700 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2">
              <ApperIcon name="Phone" size={16} />
              <span>Rückruf anfordern</span>
            </button>
          )}
        </div>
      </div>

{/* Powered by */}
      <div className="px-5 py-3 border-t border-surface-100 text-center">
        <p className="text-xs text-surface-400">
          Powered by <span className="font-semibold text-primary-500 hover:text-primary-600 transition-colors">MediWidget Pro</span>
        </p>
      </div>
    </motion.div>
  )
}

export default WidgetPreview