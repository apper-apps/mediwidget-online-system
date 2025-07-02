import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import { authService } from '@/services/api/authService'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Bitte füllen Sie alle Felder aus')
      return
    }

    try {
      setLoading(true)
      await authService.login(formData.email, formData.password)
      toast.success('Erfolgreich angemeldet!')
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
            Anmeldung für Ihr Praxis-Dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-surface-900 mb-6">
                Anmelden
              </h2>
            </div>

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
              placeholder="Ihr Passwort"
              required
              icon="Lock"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
              icon="LogIn"
            >
              {loading ? 'Anmeldung läuft...' : 'Anmelden'}
            </Button>

            <div className="text-center pt-4 border-t border-surface-200">
              <p className="text-surface-600 text-sm">
                Noch kein Konto?{' '}
                <Link 
                  to="/register" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Jetzt registrieren
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200"
        >
          <div className="flex items-start space-x-3">
            <ApperIcon name="Info" size={16} className="text-primary-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary-900 mb-1">
                Demo-Zugang
              </p>
              <p className="text-xs text-primary-700">
                E-Mail: admin@mediwidget.pro<br />
                Passwort: admin123
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login