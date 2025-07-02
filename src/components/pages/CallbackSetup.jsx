import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import { callbackService } from '@/services/api/callbackService'

const CallbackSetup = () => {
  const [callbackForm, setCallbackForm] = useState({
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true, placeholder: 'Ihr vollständiger Name' },
      { id: 'phone', type: 'tel', label: 'Telefonnummer', required: true, placeholder: '+49 123 456789' },
      { id: 'email', type: 'email', label: 'E-Mail', required: false, placeholder: 'ihre@email.de' },
      { id: 'reason', type: 'select', label: 'Grund des Rückrufs', required: true, options: [
        { value: 'appointment', label: 'Terminvereinbarung' },
        { value: 'emergency', label: 'Notfall' },
        { value: 'question', label: 'Allgemeine Frage' },
        { value: 'prescription', label: 'Rezept' },
        { value: 'results', label: 'Befunde' }
      ]},
      { id: 'message', type: 'textarea', label: 'Nachricht (optional)', required: false, placeholder: 'Weitere Informationen...' }
    ],
    notificationEmail: '',
    confirmationMessage: 'Vielen Dank für Ihre Anfrage! Wir rufen Sie in Kürze zurück.',
    autoReply: true,
    priorityHandling: true
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadCallbackSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await callbackService.getSettings()
      if (data) {
        setCallbackForm({ ...callbackForm, ...data })
      }
    } catch (err) {
      setError(err.message)
      toast.error('Fehler beim Laden der Rückruf-Einstellungen')
    } finally {
      setLoading(false)
    }
  }

  const saveCallbackSettings = async () => {
    try {
      setSaving(true)
      
      await callbackService.updateSettings(callbackForm)
      toast.success('Rückruf-Einstellungen erfolgreich gespeichert')
    } catch (err) {
      toast.error('Fehler beim Speichern der Einstellungen')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadCallbackSettings()
  }, [])

  const handleFormChange = (value, field) => {
    setCallbackForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addFormField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'Neues Feld',
      required: false,
      placeholder: ''
    }
    
    setCallbackForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  const updateFormField = (fieldId, updates) => {
    setCallbackForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
  }

  const removeFormField = (fieldId) => {
    setCallbackForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }))
  }

  const moveField = (fieldId, direction) => {
    const currentIndex = callbackForm.fields.findIndex(f => f.id === fieldId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= callbackForm.fields.length) return
    
    const newFields = [...callbackForm.fields]
    const [movedField] = newFields.splice(currentIndex, 1)
    newFields.splice(newIndex, 0, movedField)
    
    setCallbackForm(prev => ({
      ...prev,
      fields: newFields
    }))
  }

  const fieldTypeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'E-Mail' },
    { value: 'tel', label: 'Telefon' },
    { value: 'textarea', label: 'Textbereich' },
    { value: 'select', label: 'Auswahl' },
    { value: 'checkbox', label: 'Checkbox' }
  ]

  if (loading) {
    return <Loading type="form" />
  }

  if (error) {
    return <Error message={error} onRetry={loadCallbackSettings} />
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
          Rückruf-Setup
        </h1>
        <p className="text-surface-600">
          Konfigurieren Sie das Rückruf-Formular und die Benachrichtigungen
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form Fields */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-surface-900 flex items-center">
                <ApperIcon name="FormInput" size={24} className="mr-3 text-primary-600" />
                Formular-Felder
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon="Plus"
                onClick={addFormField}
              >
                Feld hinzufügen
              </Button>
            </div>
            
            <div className="space-y-4">
              {callbackForm.fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-surface-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="GripVertical" size={16} className="text-primary-600" />
                      </div>
                      <span className="font-medium text-surface-900">Feld {index + 1}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="ChevronUp"
                        onClick={() => moveField(field.id, 'up')}
                        disabled={index === 0}
                        className="text-surface-500"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="ChevronDown"
                        onClick={() => moveField(field.id, 'down')}
                        disabled={index === callbackForm.fields.length - 1}
                        className="text-surface-500"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={() => removeFormField(field.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Feld-Typ"
                      type="select"
                      value={field.type}
                      onChange={(value) => updateFormField(field.id, { type: value })}
                      options={fieldTypeOptions}
                    />
                    
                    <FormField
                      label="Label"
                      value={field.label}
                      onChange={(value) => updateFormField(field.id, { label: value })}
                      placeholder="Feldbezeichnung"
                    />
                    
                    <FormField
                      label="Platzhalter"
                      value={field.placeholder || ''}
                      onChange={(value) => updateFormField(field.id, { placeholder: value })}
                      placeholder="Platzhalter-Text"
                    />
                    
                    <div className="flex items-center space-x-4 pt-8">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm text-surface-700">Pflichtfeld</span>
                      </label>
                    </div>
                  </div>
                  
                  {field.type === 'select' && (
                    <div className="mt-4">
                      <label className="form-label">Auswahloptionen</label>
                      <div className="space-y-2">
                        {(field.options || []).map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={option.value}
                              onChange={(e) => {
                                const newOptions = [...(field.options || [])]
                                newOptions[optionIndex].value = e.target.value
                                updateFormField(field.id, { options: newOptions })
                              }}
                              placeholder="Wert"
                              className="form-input flex-1"
                            />
                            <input
                              type="text"
                              value={option.label}
                              onChange={(e) => {
                                const newOptions = [...(field.options || [])]
                                newOptions[optionIndex].label = e.target.value
                                updateFormField(field.id, { options: newOptions })
                              }}
                              placeholder="Anzeige-Text"
                              className="form-input flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="X"
                              onClick={() => {
                                const newOptions = (field.options || []).filter((_, i) => i !== optionIndex)
                                updateFormField(field.id, { options: newOptions })
                              }}
                              className="text-red-600"
                            />
                          </div>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          icon="Plus"
                          onClick={() => {
                            const newOptions = [...(field.options || []), { value: '', label: '' }]
                            updateFormField(field.id, { options: newOptions })
                          }}
                          className="text-xs"
                        >
                          Option hinzufügen
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
              <ApperIcon name="Mail" size={24} className="mr-3 text-primary-600" />
              Benachrichtigungen
            </h2>
            
            <div className="space-y-6">
              <FormField
                type="email"
                label="Benachrichtigungs-E-Mail"
                name="notificationEmail"
                value={callbackForm.notificationEmail}
                onChange={handleFormChange}
                placeholder="praxis@beispiel.de"
                helperText="An diese E-Mail-Adresse werden Rückruf-Anfragen gesendet"
                icon="Mail"
                required
              />

              <FormField
                type="textarea"
                label="Bestätigungsnachricht"
                name="confirmationMessage"
                value={callbackForm.confirmationMessage}
                onChange={handleFormChange}
                placeholder="Nachricht für den Patienten nach dem Absenden"
                rows={4}
                helperText="Diese Nachricht wird dem Patienten nach dem Absenden angezeigt"
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Zap" size={20} className="text-accent-600" />
                    <div>
                      <p className="font-medium text-surface-900">Automatische Antwort</p>
                      <p className="text-sm text-surface-600">Bestätigungs-E-Mail an Patienten senden</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={callbackForm.autoReply}
                      onChange={(e) => handleFormChange(e.target.checked, 'autoReply')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="AlertTriangle" size={20} className="text-yellow-600" />
                    <div>
                      <p className="font-medium text-surface-900">Prioritäts-Behandlung</p>
                      <p className="text-sm text-surface-600">Notfall-Anfragen sofort weiterleiten</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={callbackForm.priorityHandling}
                      onChange={(e) => handleFormChange(e.target.checked, 'priorityHandling')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button variant="secondary">
              Zurücksetzen
            </Button>
            <Button
              variant="primary"
              loading={saving}
              onClick={saveCallbackSettings}
              icon="Save"
            >
              Einstellungen speichern
            </Button>
          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="lg:sticky lg:top-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-surface-900 mb-4">
              Formular-Vorschau
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-surface-200 rounded-lg bg-surface-50">
                <h4 className="font-semibold text-surface-900 mb-4">
                  Rückruf anfordern
                </h4>
                
                <div className="space-y-3">
                  {callbackForm.fields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <label className="text-xs font-medium text-surface-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'textarea' ? (
                        <textarea
                          placeholder={field.placeholder}
                          className="w-full px-2 py-1 text-sm border border-surface-300 rounded resize-none"
                          rows={2}
                          disabled
                        />
                      ) : field.type === 'select' ? (
                        <select className="w-full px-2 py-1 text-sm border border-surface-300 rounded" disabled>
                          <option>{field.placeholder || 'Auswählen...'}</option>
                          {field.options?.map((option, i) => (
                            <option key={i} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full px-2 py-1 text-sm border border-surface-300 rounded"
                          disabled
                        />
                      )}
                    </div>
                  ))}
                  
                  <button className="w-full py-2 px-4 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors">
                    <ApperIcon name="Phone" size={14} className="mr-2 inline" />
                    Rückruf anfordern
                  </button>
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
                      Formular-Vorschau
                    </p>
                    <p className="text-sm text-primary-700 mt-1">
                      So wird das Rückruf-Formular im Widget angezeigt. 
                      Änderungen werden sofort in der Vorschau aktualisiert.
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

export default CallbackSetup