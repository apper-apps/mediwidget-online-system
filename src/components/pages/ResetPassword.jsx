import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { authService } from '@/services/api/authService'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(null)

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        const isValid = await authService.validateResetToken(token)
        setTokenValid(isValid)
        if (!isValid) {
          toast.error('Invalid or expired reset token')
          setTimeout(() => navigate('/login'), 3000)
        }
      }
    }
    validateToken()
  }, [token, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      setLoading(true)
      const result = await authService.resetPassword(token, formData.password)
      toast.success(result.message)
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (tokenValid === null) {
    return (
      <div className="flex-1 py-12 px-5 flex justify-center items-center">
        <div className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-2xl shadow-lg text-center">
          <div className="animate-spin mx-auto w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-surface-600">Validating reset token...</p>
        </div>
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div className="flex-1 py-12 px-5 flex justify-center items-center">
        <div className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-2xl shadow-lg text-center">
          <ApperIcon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-surface-900 mb-2">Invalid Reset Token</h2>
          <p className="text-surface-600">This reset link is invalid or has expired. You will be redirected to login.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-12 px-5 flex justify-center items-center">
      <div className="bg-white mx-auto w-[400px] max-w-full p-10 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 text-white text-2xl font-bold mx-auto mb-4">
            M
          </div>
          <h2 className="text-xl font-semibold text-surface-900 mb-2">Reset Password</h2>
          <p className="text-surface-600">Enter your new password</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="password"
            name="password"
            placeholder="New password (min 6 characters)"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
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
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword