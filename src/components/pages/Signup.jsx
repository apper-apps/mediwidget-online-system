import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "@/store/userSlice";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { authService } from "@/services/api/authService";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.password || !formData.confirmPassword) {
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
      const userData = await authService.register(formData)
      
// Store user in Redux
      dispatch(setUser(userData))
      toast.success('Konto erfolgreich erstellt!')
      navigate('/')
      
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
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
              Konto erstellen
            </div>
            <div className="text-center text-sm text-gray-500">
              Bitte erstellen Sie ein Konto, um fortzufahren
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
<Input
              type="text"
              name="firstName"
              placeholder="Vorname"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
<Input
              type="text"
              name="lastName"
              placeholder="Nachname"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          
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
            placeholder="Passwort erstellen (min. 6 Zeichen)"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          
<Input
            type="password"
            name="confirmPassword"
            placeholder="Passwort bestätigen"
            value={formData.confirmPassword}
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
            Konto erstellen
          </Button>
        </form>
        
<div className="text-center mt-4">
          <p className="text-sm text-surface-600">
            Bereits ein Konto?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup;