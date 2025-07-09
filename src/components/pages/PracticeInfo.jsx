import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import { practiceService } from '@/services/api/practiceService'

const PracticeInfo = () => {
const [practice, setPractice] = useState({
    name: '',
    logo: '',
    primaryColor: '#0066CC',
    secondaryColor: '#E8F2FF',
    contactEmail: '',
    contactPhone: '',
    address: '',
    website: '',
    description: '',
    domain: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

const loadPracticeInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await practiceService.getById(1)
      // Only update fields that are not already set to prevent overwriting with examples
setPractice(prev => ({
        name: data.Name || prev.name,
        logo: data.logo || prev.logo,
        primaryColor: data.primary_color || prev.primaryColor,
        secondaryColor: data.secondary_color || prev.secondaryColor,
        contactEmail: data.contact_email || prev.contactEmail,
        contactPhone: data.contact_phone || prev.contactPhone,
        address: data.address || prev.address,
        website: data.website || prev.website,
        description: data.description || prev.description,
        domain: data.domain || prev.domain
      }))
    } catch (err) {
      setError(err.message)
      toast.error('Fehler beim Laden der Praxis-Informationen')
    } finally {
      setLoading(false)
    }
  }

  const savePracticeInfo = async () => {
    try {
      setSaving(true)
      
      await practiceService.update(1, practice)
      toast.success('Praxis-Informationen erfolgreich gespeichert')
    } catch (err) {
      toast.error('Fehler beim Speichern der Praxis-Informationen')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadPracticeInfo()
  }, [])

  const handleInputChange = (value, field) => {
    setPractice(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPractice(prev => ({
          ...prev,
          logo: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const colorOptions = [
    { value: '#0066CC', label: 'Medizin Blau', color: '#0066CC' },
    { value: '#00A878', label: 'Praxis Grün', color: '#00A878' },
    { value: '#6366F1', label: 'Modern Violett', color: '#6366F1' },
    { value: '#EF4444', label: 'Notfall Rot', color: '#EF4444' },
    { value: '#F59E0B', label: 'Warm Orange', color: '#F59E0B' },
    { value: '#8B5CF6', label: 'Elegant Lila', color: '#8B5CF6' },
    { value: '#10B981', label: 'Gesundheit Grün', color: '#10B981' },
    { value: '#3B82F6', label: 'Vertrauen Blau', color: '#3B82F6' }
  ]

  if (loading) {
    return <Loading type="form" />
  }

  if (error) {
    return <Error message={error} onRetry={loadPracticeInfo} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-surface-900 mb-2">
          Praxis-Informationen
        </h1>
        <p className="text-surface-600">
          Konfigurieren Sie die grundlegenden Informationen Ihrer Praxis für das Widget
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
              <ApperIcon name="Building2" size={24} className="mr-3 text-primary-600" />
              Grundlegende Informationen
            </h2>
            
            <div className="space-y-6">
              <FormField
                label="Praxis-Name"
                name="name"
                value={practice.name}
                onChange={handleInputChange}
                placeholder="z.B. Dr. Mustermann Hausarztpraxis"
                required
                icon="Building2"
              />

              <FormField
                type="textarea"
                label="Beschreibung"
                name="description"
                value={practice.description}
                onChange={handleInputChange}
                placeholder="Kurze Beschreibung Ihrer Praxis..."
                rows={4}
                helperText="Diese Beschreibung wird im Widget angezeigt"
              />
<div>
                <label className="form-label">Praxis-Logo</label>
                <div className="mt-2 flex items-center space-x-4">
                  {practice.logo && (
                    <img
                      src={practice.logo}
                      alt="Logo Vorschau"
                      className="w-16 h-16 rounded-lg object-cover border border-surface-200"
                    />
                  )}
                  
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="btn-secondary inline-flex items-center cursor-pointer"
                    >
                      <ApperIcon name="Upload" size={16} className="mr-2" />
                      Logo hochladen
                    </label>
                    <p className="text-sm text-surface-600 mt-1">
                      Empfohlen: 200x200px, PNG oder JPG
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                label="Benutzerdefinierte Widget-Domain"
                name="domain"
                value={practice.domain}
                onChange={handleInputChange}
                placeholder="z.B. widgets.ihre-praxis.de"
                icon="Globe"
                helperText="Optional: Verwenden Sie Ihre eigene Domain für das Widget anstatt der Standard-CDN-URL"
              />
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
              <ApperIcon name="Contact" size={24} className="mr-3 text-primary-600" />
              Kontaktinformationen
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                type="email"
                label="E-Mail-Adresse"
                name="contactEmail"
                value={practice.contactEmail}
                onChange={handleInputChange}
                placeholder="praxis@beispiel.de"
                icon="Mail"
              />

              <FormField
                type="tel"
                label="Telefonnummer"
                name="contactPhone"
                value={practice.contactPhone}
                onChange={handleInputChange}
                placeholder="+49 123 456789"
                icon="Phone"
              />

              <FormField
                label="Website"
                name="website"
                value={practice.website}
                onChange={handleInputChange}
                placeholder="https://www.ihre-praxis.de"
                icon="Globe"
                className="md:col-span-2"
              />

              <FormField
                type="textarea"
                label="Adresse"
                name="address"
                value={practice.address}
                onChange={handleInputChange}
                placeholder="Musterstraße 123, 12345 Musterstadt"
                rows={3}
                className="md:col-span-2"
              />
            </div>
          </Card>

          {/* Color Theme */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
              <ApperIcon name="Palette" size={24} className="mr-3 text-primary-600" />
              Farbschema
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="form-label">Primärfarbe</label>
                <p className="text-sm text-surface-600 mb-4">
                  Diese Farbe wird für Buttons und Akzente verwendet
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange(option.value, 'primaryColor')}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105
                        ${practice.primaryColor === option.value 
                          ? 'border-surface-900 shadow-lg' 
                          : 'border-surface-200 hover:border-surface-300'
                        }
                      `}
                    >
                      <div 
                        className="w-full h-8 rounded-md mb-2"
                        style={{ backgroundColor: option.color }}
                      ></div>
                      <p className="text-xs font-medium text-surface-700 text-center">
                        {option.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Aktuelle Farbauswahl</label>
                <div className="flex items-center space-x-4 p-4 bg-surface-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-lg border border-surface-200"
                      style={{ backgroundColor: practice.primaryColor }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">Primärfarbe</p>
                      <p className="text-xs text-surface-600">{practice.primaryColor}</p>
                    </div>
                  </div>
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
              onClick={savePracticeInfo}
              icon="Save"
            >
              Informationen speichern
            </Button>
          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="lg:sticky lg:top-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-surface-900 mb-4">
              Vorschau
            </h3>
            
            <div className="space-y-4">
              {/* Practice Card Preview */}
<div className="p-4 border border-surface-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  {practice.logo ? (
                    <img
                      src={practice.logo}
                      alt="Logo"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-surface-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Building2" size={24} className="text-surface-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-surface-900">
                      {practice.name || 'Praxis-Name'}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                      <span className="text-xs text-surface-600">Online</span>
                    </div>
                    {practice.domain && (
                      <p className="text-xs text-surface-500 mt-1">
                        Widget-Domain: {practice.domain}
                      </p>
                    )}
                  </div>
                </div>
                
                {practice.description && (
                  <p className="text-sm text-surface-600 mb-3">
                    {practice.description}
                  </p>
                )}
                
                <button 
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: practice.primaryColor }}
                >
                  <ApperIcon name="Calendar" size={16} className="mr-2 inline" />
                  Termin vereinbaren
                </button>
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
                      Widget-Vorschau
                    </p>
                    <p className="text-sm text-primary-700 mt-1">
                      So wird Ihre Praxis im Widget dargestellt. Änderungen werden 
                      sofort in der Vorschau angezeigt.
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

export default PracticeInfo