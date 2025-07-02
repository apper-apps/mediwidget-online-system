import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import { authService } from '@/services/api/authService'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    practiceName: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.password || !formData.confirmPassword || !formData.practiceName) {
      toast.error('Bitte füllen Sie alle Felder aus')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwörter stimmen nicht überein')
      return false
    }

    if (formData.password.length < 6) {
      toast.error('Passwort muss mindestens 6 Zeichen lang sein')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        practiceName: formData.practiceName
      })
      toast.success('Registrierung erfolgreich! Sie sind jetzt angemeldet.')
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <ApperIcon name="Activity" size={32} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">
            MediWidget Pro
          </h1>
          <p className="text-surface-600">
            Registrierung für Ihre Praxis
          </p>
        </div>

        {/* Registration Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-surface-900 mb-6">
                Neues Konto erstellen
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Vorname"
                type="text"
                value={formData.firstName}
                onChange={(value) => handleInputChange(value, 'firstName')}
                placeholder="Max"
                required
                icon="User"
              />

              <FormField
                label="Nachname"
                type="text"
                value={formData.lastName}
                onChange={(value) => handleInputChange(value, 'lastName')}
                placeholder="Mustermann"
                required
              />
            </div>

            <FormField
              label="Praxis-Name"
              type="text"
              value={formData.practiceName}
              onChange={(value) => handleInputChange(value, 'practiceName')}
              placeholder="Praxis Dr. Mustermann"
              required
              icon="Building"
            />

            <FormField
              label="E-Mail-Adresse"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange(value, 'email')}
              placeholder="ihre@praxis-email.de"
              required
              icon="Mail"
            />

            <FormField
              label="Passwort"
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange(value, 'password')}
              placeholder="Mindestens 6 Zeichen"
              required
              icon="Lock"
            />

            <FormField
              label="Passwort bestätigen"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange(value, 'confirmPassword')}
              placeholder="Passwort wiederholen"
              required
              icon="Lock"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
              icon="UserPlus"
            >
              {loading ? 'Registrierung läuft...' : 'Konto erstellen'}
            </Button>

            <div className="text-center pt-4 border-t border-surface-200">
              <p className="text-surface-600 text-sm">
                Bereits ein Konto?{' '}
                <Link 
                  to="/login" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Jetzt anmelden
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-accent-50 rounded-lg border border-accent-200"
        >
          <div className="flex items-start space-x-3">
            <ApperIcon name="Sparkles" size={16} className="text-accent-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-accent-900 mb-1">
                Was Sie erwartet
              </p>
              <ul className="text-xs text-accent-700 space-y-1">
                <li>• Anpassbares Widget für Ihre Website</li>
                <li>• Terminbuchung und Rückruf-System</li>
                <li>• Detaillierte Analytics und Berichte</li>
                <li>• Intelligenter Chatbot-Builder</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Register