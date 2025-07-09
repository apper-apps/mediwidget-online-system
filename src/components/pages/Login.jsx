import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "@/store/userSlice";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { authService } from "@/services/api/authService";

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      const userData = await authService.login(formData)
      
      // Store user in Redux
      dispatch(setUser(userData))
      
      toast.success('Anmeldung erfolgreich!')
      navigate('/')
      
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!resetEmail) {
      toast.error('Bitte geben Sie Ihre E-Mail-Adresse ein')
      return
    }
    try {
      setResetLoading(true)
      const result = await authService.requestPasswordReset(resetEmail)
      toast.success(result.message)
      setShowForgotPassword(false)
      setResetEmail('')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setResetLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50">
        <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div className="flex flex-col gap-6 items-center justify-center">
            <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 text-white text-2xl 2xl:text-3xl font-bold">
              M
            </div>
<div className="flex flex-col gap-1 items-center justify-center">
              <div className="text-center text-lg xl:text-xl font-bold">
                Passwort zurücksetzen
              </div>
              <div className="text-center text-sm text-gray-500">
                Geben Sie Ihre E-Mail-Adresse ein, um einen Reset-Link zu erhalten
              </div>
            </div>
          </div>
          
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <Input
type="email"
              name="resetEmail"
              placeholder="E-Mail-Adresse eingeben"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
loading={resetLoading}
              className="w-full"
            >
              Reset-Link senden
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="lg"
onClick={() => setShowForgotPassword(false)}
              className="w-full"
            >
              Zurück zur Anmeldung
            </Button>
          </form>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 text-white text-2xl 2xl:text-3xl font-bold">
            M
          </div>
<div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Bei MediWidget Pro anmelden
            </div>
            <div className="text-center text-sm text-gray-500">
              Willkommen zurück, bitte melden Sie sich an, um fortzufahren
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
type="email"
            name="email"
            placeholder="E-Mail-Adresse eingeben"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
<Input
            type="password"
            name="password"
            placeholder="Passwort eingeben"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
className="w-full"
          >
            Anmelden
          </Button>
          
          <div className="text-center">
            <button
              type="button"
onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Passwort vergessen?
            </button>
          </div>
        </form>
        
<div className="text-center mt-4">
          <p className="text-sm text-surface-600">
            Noch kein Konto?{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-700">
              Registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login