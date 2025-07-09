import bcrypt from 'bcryptjs'
import { toast } from 'react-toastify'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Initialize ApperClient for database operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

// Generate reset token
const generateResetToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

// Verify password
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

export const authService = {
  // Login user
  async login(credentials) {
    try {
      await delay(300)
      const apperClient = getApperClient()
      
      // Fetch user by email
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "password" } },
          { field: { Name: "registrationStatus" } }
        ],
        where: [
          {
            FieldName: "email",
            Operator: "EqualTo",
            Values: [credentials.email]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('app_User', params)
      
      if (!response.success) {
        throw new Error('Login failed. Please try again.')
      }
      
      if (!response.data || response.data.length === 0) {
        throw new Error('Invalid email or password.')
      }
      
      const user = response.data[0]
      
      // Check if user is active
      if (user.registrationStatus !== 'registered') {
        throw new Error('Account is not active. Please contact support.')
      }
      
      // Verify password
      const isPasswordValid = await verifyPassword(credentials.password, user.password)
      if (!isPasswordValid) {
        throw new Error('Invalid email or password.')
      }
      
      // Return user data (excluding password)
      const { password, ...userData } = user
      return userData
      
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Login failed. Please try again.')
    }
  },

  // Register new user
  async register(userData) {
    try {
      await delay(300)
      const apperClient = getApperClient()
      
      // Check if user already exists
      const existingUserParams = {
        fields: [
          { field: { Name: "email" } }
        ],
        where: [
          {
            FieldName: "email",
            Operator: "EqualTo",
            Values: [userData.email]
          }
        ]
      }
      
      const existingUserResponse = await apperClient.fetchRecords('app_User', existingUserParams)
      
      if (existingUserResponse.success && existingUserResponse.data && existingUserResponse.data.length > 0) {
        throw new Error('An account with this email already exists.')
      }
      
      // Hash password
      const hashedPassword = await hashPassword(userData.password)
      
      // Create new user
      const createParams = {
        records: [
          {
            Name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            password: hashedPassword,
            registrationStatus: 'registered'
          }
        ]
      }
      
      const response = await apperClient.createRecord('app_User', createParams)
      
      if (!response.success) {
        throw new Error('Registration failed. Please try again.')
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0]
        if (!result.success) {
          throw new Error(result.message || 'Registration failed. Please try again.')
        }
        
        // Return user data (excluding password)
        const { password, ...newUserData } = result.data
        return newUserData
      }
      
      throw new Error('Registration failed. Please try again.')
      
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error(error.message || 'Registration failed. Please try again.')
    }
  },

  // Request password reset
  async requestPasswordReset(email) {
    try {
      await delay(300)
      const apperClient = getApperClient()
      
      // Check if user exists
      const userParams = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } }
        ],
        where: [
          {
            FieldName: "email",
            Operator: "EqualTo",
            Values: [email]
          }
        ]
      }
      
      const userResponse = await apperClient.fetchRecords('app_User', userParams)
      
      if (!userResponse.success || !userResponse.data || userResponse.data.length === 0) {
        throw new Error('No account found with this email address.')
      }
      
      const user = userResponse.data[0]
      
      // Generate reset token and expiration
      const resetToken = generateResetToken()
      const tokenExpiration = new Date(Date.now() + 3600000) // 1 hour from now
      
      // Update user with reset token
      const updateParams = {
        records: [
          {
            Id: user.Id,
            resetToken: resetToken,
            tokenExpiration: tokenExpiration.toISOString()
          }
        ]
      }
      
      const updateResponse = await apperClient.updateRecord('app_User', updateParams)
      
      if (!updateResponse.success) {
        throw new Error('Failed to generate reset token. Please try again.')
      }
      
      // In a real application, you would send an email here
      // For now, we'll just return the token for demonstration
      return {
        message: 'Password reset link has been sent to your email.',
        resetToken: resetToken // In production, this would be sent via email
      }
      
    } catch (error) {
      console.error('Password reset request error:', error)
      throw new Error(error.message || 'Failed to request password reset. Please try again.')
    }
  },

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      await delay(300)
      const apperClient = getApperClient()
      
      // Find user by reset token
      const userParams = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "resetToken" } },
          { field: { Name: "tokenExpiration" } }
        ],
        where: [
          {
            FieldName: "resetToken",
            Operator: "EqualTo",
            Values: [token]
          }
        ]
      }
      
      const userResponse = await apperClient.fetchRecords('app_User', userParams)
      
      if (!userResponse.success || !userResponse.data || userResponse.data.length === 0) {
        throw new Error('Invalid or expired reset token.')
      }
      
      const user = userResponse.data[0]
      
      // Check if token is expired
      const tokenExpiration = new Date(user.tokenExpiration)
      if (tokenExpiration < new Date()) {
        throw new Error('Reset token has expired. Please request a new one.')
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword)
      
      // Update user with new password and clear reset token
      const updateParams = {
        records: [
          {
            Id: user.Id,
            password: hashedPassword,
            resetToken: null,
            tokenExpiration: null
          }
        ]
      }
      
      const updateResponse = await apperClient.updateRecord('app_User', updateParams)
      
      if (!updateResponse.success) {
        throw new Error('Failed to update password. Please try again.')
      }
      
      return {
        message: 'Password has been reset successfully. You can now log in with your new password.'
      }
      
    } catch (error) {
      console.error('Password reset error:', error)
      throw new Error(error.message || 'Failed to reset password. Please try again.')
    }
  },

  // Validate reset token
  async validateResetToken(token) {
    try {
      await delay(300)
      const apperClient = getApperClient()
      
      // Find user by reset token
      const userParams = {
        fields: [
          { field: { Name: "resetToken" } },
          { field: { Name: "tokenExpiration" } }
        ],
        where: [
          {
            FieldName: "resetToken",
            Operator: "EqualTo",
            Values: [token]
          }
        ]
      }
      
      const userResponse = await apperClient.fetchRecords('app_User', userParams)
      
      if (!userResponse.success || !userResponse.data || userResponse.data.length === 0) {
        return false
      }
      
      const user = userResponse.data[0]
      
      // Check if token is expired
      const tokenExpiration = new Date(user.tokenExpiration)
      if (tokenExpiration < new Date()) {
        return false
      }
      
      return true
      
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }
}