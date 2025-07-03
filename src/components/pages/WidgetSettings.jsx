import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import WidgetPreview from "@/components/organisms/WidgetPreview";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";
import { openingHoursService } from "@/services/api/openingHoursService";
import { practiceService } from "@/services/api/practiceService";
import { widgetService } from "@/services/api/widgetService";

const WidgetSettings = () => {
  const [settings, setSettings] = useState({
    showChatbot: true,
    showCallback: true,
    showAppointment: true,
    showOpeningHours: true,
    theme: 'light',
    position: 'bottom-right',
    size: 'medium',
borderRadius: 'rounded',
    animation: 'slide'
  });
  const [practiceInfo, setPracticeInfo] = useState({});
  const [openingHours, setOpeningHours] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [widgetData, practiceData, hoursData] = await Promise.all([
        widgetService.getById(1),
        practiceService.getById(1),
        openingHoursService.getAll()
      ]);
      
      if (widgetData.config) {
        setSettings({ ...settings, ...widgetData.config });
      }
      setPracticeInfo(practiceData || {});
      setOpeningHours(hoursData || []);
    } catch (err) {
      setError(err.message)
      toast.error('Fehler beim Laden der Widget-Einstellungen')
    } finally {
      setLoading(false)
    }
  }

const saveSettings = async () => {
    try {
      setSaving(true)
      
      // Update widget settings
      await widgetService.update(1, {
        config: settings,
        isActive: true
      })

      // Update practice info if color changed
      if (settings.primaryColor && settings.primaryColor !== practiceInfo.primaryColor) {
        await practiceService.update(1, {
          primaryColor: settings.primaryColor
        })
        setPracticeInfo(prev => ({ ...prev, primaryColor: settings.primaryColor }))
      }
      
      toast.success('Widget-Einstellungen erfolgreich gespeichert')
    } catch (err) {
      toast.error('Fehler beim Speichern der Einstellungen')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSettingChange = (value, field) => {
    setSettings(prev => ({
      ...prev,
      [field]: field.startsWith('show') ? value === 'true' : value
    }))
  }

  const colorOptions = [
    { value: '#0066CC', label: 'Medizin Blau', color: '#0066CC' },
    { value: '#00A878', label: 'Praxis Grün', color: '#00A878' },
    { value: '#6366F1', label: 'Modern Violett', color: '#6366F1' },
    { value: '#EF4444', label: 'Notfall Rot', color: '#EF4444' },
    { value: '#F59E0B', label: 'Warm Orange', color: '#F59E0B' },
    { value: '#8B5CF6', label: 'Elegant Lila', color: '#8B5CF6' }
  ]

  if (loading) {
    return <Loading type="form" />
  }

  if (error) {
    return <Error message={error} onRetry={loadSettings} />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Settings Panel */}
      <div className="space-y-6">
        {/* General Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
            <ApperIcon name="Settings" size={24} className="mr-3 text-primary-600" />
            Allgemeine Einstellungen
          </h2>
          
          <div className="space-y-6">
            {/* Widget Features */}
            <div>
              <h3 className="text-lg font-semibold text-surface-900 mb-4">
                Widget-Funktionen
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="MessageSquare" size={20} className="text-primary-600" />
                    <div>
                      <p className="font-medium text-surface-900">Chatbot</p>
                      <p className="text-sm text-surface-600">Automatische Patientenbetreuung</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showChatbot}
                      onChange={(e) => handleSettingChange(e.target.checked, 'showChatbot')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Phone" size={20} className="text-accent-600" />
                    <div>
                      <p className="font-medium text-surface-900">Rückruf-Service</p>
                      <p className="text-sm text-surface-600">Patienten können Rückruf anfordern</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showCallback}
                      onChange={(e) => handleSettingChange(e.target.checked, 'showCallback')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Calendar" size={20} className="text-green-600" />
                    <div>
                      <p className="font-medium text-surface-900">Terminbuchung</p>
                      <p className="text-sm text-surface-600">Direkte Online-Terminvereinbarung</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showAppointment}
                      onChange={(e) => handleSettingChange(e.target.checked, 'showAppointment')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
            <ApperIcon name="Palette" size={24} className="mr-3 text-primary-600" />
            Design & Aussehen
          </h2>
          
          <div className="space-y-6">
            <FormField
              type="select"
              label="Farbschema"
              name="theme"
              value={settings.theme}
              onChange={handleSettingChange}
              options={[
                { value: 'light', label: 'Hell' },
                { value: 'dark', label: 'Dunkel' },
                { value: 'auto', label: 'Automatisch' }
              ]}
            />

<div>
              <label className="form-label">Primärfarbe</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleSettingChange(option.value, 'primaryColor');
                      setSettings(prev => ({ ...prev, primaryColor: option.value }));
                    }}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2
                      ${(settings.primaryColor || practiceInfo.primaryColor) === option.value 
                        ? 'border-surface-900 shadow-md' 
                        : 'border-surface-200 hover:border-surface-300'
                      }
                    `}
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: option.color }}
                    ></div>
                    <span className="text-sm font-medium text-surface-700">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <FormField
              type="select"
              label="Widget-Position"
              name="position"
              value={settings.position}
              onChange={handleSettingChange}
              options={[
                { value: 'bottom-right', label: 'Unten rechts' },
                { value: 'bottom-left', label: 'Unten links' },
                { value: 'top-right', label: 'Oben rechts' },
                { value: 'top-left', label: 'Oben links' }
              ]}
            />

            <FormField
              type="select"
              label="Widget-Größe"
              name="size"
              value={settings.size}
              onChange={handleSettingChange}
              options={[
                { value: 'small', label: 'Klein' },
                { value: 'medium', label: 'Mittel' },
                { value: 'large', label: 'Groß' }
              ]}
            />
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
            onClick={saveSettings}
            icon="Save"
          >
            Einstellungen speichern
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:sticky lg:top-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-surface-900">
              Live-Vorschau
            </h2>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon="Monitor"
                className="text-xs"
              >
                Desktop
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="Smartphone"
                className="text-xs"
              >
                Mobil
              </Button>
            </div>
          </div>
          
<div className="flex justify-center">
            <WidgetPreview
              practiceInfo={{ ...practiceInfo, primaryColor: settings.primaryColor || practiceInfo.primaryColor }}
              openingHours={openingHours}
              showChatbot={settings.showChatbot}
              showCallback={settings.showCallback}
              showAppointment={settings.showAppointment}
              size="desktop"
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-primary-50 rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <ApperIcon name="Info" size={16} className="text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary-900">
                  Vorschau-Hinweis
                </p>
                <p className="text-sm text-primary-700 mt-1">
                  Diese Vorschau zeigt, wie Ihr Widget auf der Website erscheinen wird. 
                  Änderungen werden in Echtzeit angezeigt.
                </p>
              </div>
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  )
}

export default WidgetSettings