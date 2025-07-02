import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import { openingHoursService } from '@/services/api/openingHoursService'

const OpeningHours = () => {
  const [hours, setHours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [specialHours, setSpecialHours] = useState([])

  const dayNames = [
    'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 
    'Freitag', 'Samstag', 'Sonntag'
  ]

  const loadOpeningHours = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await openingHoursService.getAll()
      
      // Ensure we have all 7 days
      const fullWeek = Array.from({ length: 7 }, (_, index) => {
        const existing = data.find(h => h.dayOfWeek === index)
        return existing || {
          Id: Date.now() + index,
          dayOfWeek: index,
          openTime: '09:00',
          closeTime: '17:00',
          isClosed: index === 6, // Sunday closed by default
          breaks: []
        }
      })
      
      setHours(fullWeek)
    } catch (err) {
      setError(err.message)
      toast.error('Fehler beim Laden der Öffnungszeiten')
    } finally {
      setLoading(false)
    }
  }

  const saveOpeningHours = async () => {
    try {
      setSaving(true)
      
      // Save each day's hours
      for (const dayHours of hours) {
        if (dayHours.Id && dayHours.Id > 7) {
          // New entry
          await openingHoursService.create(dayHours)
        } else {
          // Update existing
          await openingHoursService.update(dayHours.dayOfWeek, dayHours)
        }
      }
      
      toast.success('Öffnungszeiten erfolgreich gespeichert')
    } catch (err) {
      toast.error('Fehler beim Speichern der Öffnungszeiten')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadOpeningHours()
  }, [])

  const updateDayHours = (dayIndex, field, value) => {
    setHours(prev => prev.map(day => 
      day.dayOfWeek === dayIndex 
        ? { ...day, [field]: value }
        : day
    ))
  }

  const toggleDayClosed = (dayIndex) => {
    setHours(prev => prev.map(day => 
      day.dayOfWeek === dayIndex 
        ? { ...day, isClosed: !day.isClosed }
        : day
    ))
  }

  const addBreak = (dayIndex) => {
    setHours(prev => prev.map(day => 
      day.dayOfWeek === dayIndex 
        ? { 
            ...day, 
            breaks: [...(day.breaks || []), { start: '12:00', end: '13:00' }]
          }
        : day
    ))
  }

  const removeBreak = (dayIndex, breakIndex) => {
    setHours(prev => prev.map(day => 
      day.dayOfWeek === dayIndex 
        ? { 
            ...day, 
            breaks: day.breaks.filter((_, index) => index !== breakIndex)
          }
        : day
    ))
  }

  const addSpecialHours = () => {
    setSpecialHours(prev => [...prev, {
      Id: Date.now(),
      date: '',
      openTime: '09:00',
      closeTime: '17:00',
      isClosed: false,
      description: ''
    }])
  }

  if (loading) {
    return <Loading type="form" />
  }

  if (error) {
    return <Error message={error} onRetry={loadOpeningHours} />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-surface-900 mb-2">
          Öffnungszeiten
        </h1>
        <p className="text-surface-600">
          Konfigurieren Sie die Öffnungszeiten Ihrer Praxis für das Widget
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Hours Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Regular Hours */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
              <ApperIcon name="Clock" size={24} className="mr-3 text-primary-600" />
              Reguläre Öffnungszeiten
            </h2>
            
            <div className="space-y-4">
              {hours.map((day, index) => (
                <motion.div
                  key={day.dayOfWeek}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-surface-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-surface-900">
                      {dayNames[index]}
                    </h3>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!day.isClosed}
                        onChange={() => toggleDayClosed(index)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      <span className="ml-3 text-sm font-medium text-surface-700">
                        {day.isClosed ? 'Geschlossen' : 'Geöffnet'}
                      </span>
                    </label>
                  </div>
                  
                  {!day.isClosed && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Öffnungszeit</label>
                          <input
                            type="time"
                            value={day.openTime}
                            onChange={(e) => updateDayHours(index, 'openTime', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        
                        <div>
                          <label className="form-label">Schließzeit</label>
                          <input
                            type="time"
                            value={day.closeTime}
                            onChange={(e) => updateDayHours(index, 'closeTime', e.target.value)}
                            className="form-input"
                          />
                        </div>
                      </div>
                      
                      {/* Breaks */}
                      {day.breaks && day.breaks.length > 0 && (
                        <div className="space-y-2">
                          <label className="form-label">Pausen</label>
                          {day.breaks.map((breakTime, breakIndex) => (
                            <div key={breakIndex} className="grid grid-cols-5 gap-2 items-end">
                              <div className="col-span-2">
                                <input
                                  type="time"
                                  value={breakTime.start}
                                  onChange={(e) => {
                                    const newBreaks = [...day.breaks]
                                    newBreaks[breakIndex].start = e.target.value
                                    updateDayHours(index, 'breaks', newBreaks)
                                  }}
                                  className="form-input text-sm"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="time"
                                  value={breakTime.end}
                                  onChange={(e) => {
                                    const newBreaks = [...day.breaks]
                                    newBreaks[breakIndex].end = e.target.value
                                    updateDayHours(index, 'breaks', newBreaks)
                                  }}
                                  className="form-input text-sm"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon="Trash2"
                                onClick={() => removeBreak(index, breakIndex)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Plus"
                        onClick={() => addBreak(index)}
                        className="text-xs"
                      >
                        Pause hinzufügen
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Special Hours */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-surface-900 flex items-center">
                <ApperIcon name="CalendarDays" size={24} className="mr-3 text-primary-600" />
                Sonderöffnungszeiten
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon="Plus"
                onClick={addSpecialHours}
              >
                Hinzufügen
              </Button>
            </div>
            
            {specialHours.length === 0 ? (
              <div className="text-center py-8 text-surface-600">
                <ApperIcon name="Calendar" size={48} className="mx-auto mb-4 text-surface-400" />
                <p>Keine Sonderöffnungszeiten konfiguriert</p>
                <p className="text-sm">Fügen Sie Feiertage oder besondere Termine hinzu</p>
              </div>
            ) : (
              <div className="space-y-4">
                {specialHours.map((special, index) => (
                  <div key={special.Id} className="p-4 border border-surface-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        type="date"
                        label="Datum"
                        value={special.date}
                        onChange={(value) => {
                          setSpecialHours(prev => prev.map(s => 
                            s.Id === special.Id ? { ...s, date: value } : s
                          ))
                        }}
                      />
                      
                      <FormField
                        type="time"
                        label="Von"
                        value={special.openTime}
                        onChange={(value) => {
                          setSpecialHours(prev => prev.map(s => 
                            s.Id === special.Id ? { ...s, openTime: value } : s
                          ))
                        }}
                        disabled={special.isClosed}
                      />
                      
                      <FormField
                        type="time"
                        label="Bis"
                        value={special.closeTime}
                        onChange={(value) => {
                          setSpecialHours(prev => prev.map(s => 
                            s.Id === special.Id ? { ...s, closeTime: value } : s
                          ))
                        }}
                        disabled={special.isClosed}
                      />
                      
                      <div className="flex items-end space-x-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={special.isClosed}
                            onChange={(e) => {
                              setSpecialHours(prev => prev.map(s => 
                                s.Id === special.Id ? { ...s, isClosed: e.target.checked } : s
                              ))
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">Geschlossen</span>
                        </label>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => {
                            setSpecialHours(prev => prev.filter(s => s.Id !== special.Id))
                          }}
                          className="text-red-600 hover:text-red-700"
                        />
                      </div>
                    </div>
                    
                    <FormField
                      type="textarea"
                      label="Beschreibung (optional)"
                      value={special.description}
                      onChange={(value) => {
                        setSpecialHours(prev => prev.map(s => 
                          s.Id === special.Id ? { ...s, description: value } : s
                        ))
                      }}
                      placeholder="z.B. Weihnachtsfeiertag, Fortbildung..."
                      rows={2}
                      className="mt-4"
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button variant="secondary">
              Zurücksetzen
            </Button>
            <Button
              variant="primary"
              loading={saving}
              onClick={saveOpeningHours}
              icon="Save"
            >
              Öffnungszeiten speichern
            </Button>
          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="lg:sticky lg:top-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-surface-900 mb-4">
              Widget-Vorschau
            </h3>
            
            <div className="space-y-4">
              {/* Current Status */}
              <div className="p-4 bg-surface-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                  <span className="font-medium text-surface-900">Aktueller Status</span>
                </div>
                <p className="text-sm text-surface-600">
                  Geöffnet bis 17:00 Uhr
                </p>
              </div>
              
              {/* Hours Display */}
              <div className="space-y-2">
                <h4 className="font-medium text-surface-900 text-sm">Öffnungszeiten</h4>
                {hours.slice(0, 5).map((day, index) => (
                  <div key={day.dayOfWeek} className="flex justify-between text-sm">
                    <span className="text-surface-600">{dayNames[index].substring(0, 2)}:</span>
                    <span className="text-surface-900">
                      {day.isClosed ? 'Geschlossen' : `${day.openTime} - ${day.closeTime}`}
                    </span>
                  </div>
                ))}
                {hours[5] && !hours[5].isClosed && (
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600">Sa:</span>
                    <span className="text-surface-900">
                      {hours[5].openTime} - {hours[5].closeTime}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600">So:</span>
                  <span className="text-surface-900">Geschlossen</span>
                </div>
              </div>
              
              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-primary-50 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Info" size={16} className="text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary-900">
                      Widget-Integration
                    </p>
                    <p className="text-sm text-primary-700 mt-1">
                      Die Öffnungszeiten werden automatisch im Widget angezeigt 
                      und der aktuelle Status wird in Echtzeit aktualisiert.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OpeningHours