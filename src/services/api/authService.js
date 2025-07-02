import bcrypt from 'bcryptjs'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock user data storage
let userData = [
  {
    Id: 1,
    email: 'admin@mediwidget.pro',
    password: '$2a$10$rQJ8vDfGxVbmZ.X5QZvP4eKbBjvJ8qO3fGq9KqJhJJJJJJJJJJJJJ', // password: admin123
    firstName: 'Admin',
    lastName: 'User',
    practiceId: 1,
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString()
  }
]

let currentUser = null
let lastUsedId = 1

// Token management
const TOKEN_KEY = 'mediwidget_auth_token'
const USER_KEY = 'mediwidget_current_user'

export const authService = {
async register(registrationData) {
    await delay(400)
    
    // Ensure registrationData is an object
    if (!registrationData || typeof registrationData !== 'object') {
      throw new Error('Ungültige Registrierungsdaten')
    }
    
    const { email, password, firstName, lastName, practiceName } = registrationData
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName || !practiceName) {
      throw new Error('Alle Felder sind erforderlich')
    }
    
    // Ensure userData array exists and is valid
    if (!Array.isArray(userData)) {
      throw new Error('Benutzerdaten nicht verfügbar')
    }
    
    // Check if email already exists
    if (userData.find(u => u?.email?.toLowerCase() === email.toLowerCase())) {
      throw new Error('E-Mail-Adresse bereits registriert')
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Ungültige E-Mail-Adresse')
    }
    
    // Validate password strength
    if (password.length < 6) {
      throw new Error('Passwort muss mindestens 6 Zeichen lang sein')
    }
    
    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    // Create new user
    const newId = ++lastUsedId
    const newUser = {
      Id: newId,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      practiceName,
      practiceId: newId, // Each user gets their own practice
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString()
    }
    
    userData.push(newUser)
    
    // Generate token
    const token = this.generateToken(newUser)
    this.setAuthToken(token)
    this.setCurrentUser(newUser)
    
    return {
      user: this.sanitizeUser(newUser),
      token
    }
  },

  async login(email, password) {
    await delay(300)
    
    if (!email || !password) {
      throw new Error('E-Mail und Passwort sind erforderlich')
    }
    
    // Find user by email
    const user = userData.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      throw new Error('Ungültige Anmeldedaten')
    }
    
    // Check if user is active
    if (!user.isActive) {
      throw new Error('Benutzerkonto ist deaktiviert')
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Ungültige Anmeldedaten')
    }
    
    // Generate token
    const token = this.generateToken(user)
    this.setAuthToken(token)
    this.setCurrentUser(user)
    
    currentUser = user
    
    return {
      user: this.sanitizeUser(user),
      token
    }
  },

  async logout() {
    await delay(200)
    
    currentUser = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    
    return { success: true }
  },

  async getCurrentUser() {
    await delay(100)
    
    if (currentUser) {
      return this.sanitizeUser(currentUser)
    }
    
    // Try to restore from localStorage
    const storedUser = localStorage.getItem(USER_KEY)
    const storedToken = localStorage.getItem(TOKEN_KEY)
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser)
        if (this.validateToken(storedToken)) {
          currentUser = user
          return this.sanitizeUser(user)
        }
      } catch (error) {
        this.logout()
      }
    }
    
    return null
  },

  async updateProfile(userId, updates) {
    await delay(350)
    
    const userIndex = userData.findIndex(u => u.Id === parseInt(userId))
    if (userIndex === -1) {
      throw new Error('Benutzer nicht gefunden')
    }
    
    // Validate email if being updated
    if (updates.email) {
      const emailExists = userData.find(u => 
        u.Id !== parseInt(userId) && 
        u.email.toLowerCase() === updates.email.toLowerCase()
      )
      if (emailExists) {
        throw new Error('E-Mail-Adresse bereits vergeben')
      }
    }
    
    // Hash new password if provided
    if (updates.password) {
      if (updates.password.length < 6) {
        throw new Error('Passwort muss mindestens 6 Zeichen lang sein')
      }
      updates.password = await bcrypt.hash(updates.password, 10)
    }
    
    userData[userIndex] = {
      ...userData[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    // Update current user if it's the same user
    if (currentUser && currentUser.Id === parseInt(userId)) {
      currentUser = userData[userIndex]
      this.setCurrentUser(currentUser)
    }
    
    return this.sanitizeUser(userData[userIndex])
  },

  async changePassword(userId, currentPassword, newPassword) {
    await delay(300)
    
    const user = userData.find(u => u.Id === parseInt(userId))
    if (!user) {
      throw new Error('Benutzer nicht gefunden')
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      throw new Error('Aktuelles Passwort ist falsch')
    }
    
    // Validate new password
    if (newPassword.length < 6) {
      throw new Error('Neues Passwort muss mindestens 6 Zeichen lang sein')
    }
    
    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this.updateProfile(userId, { password: hashedPassword })
    
    return { success: true }
  },

  isAuthenticated() {
    return currentUser !== null || (
      localStorage.getItem(TOKEN_KEY) && 
      localStorage.getItem(USER_KEY)
    )
  },

  generateToken(user) {
    // Simple token generation - in production, use JWT
    const payload = {
      userId: user.Id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }
    return btoa(JSON.stringify(payload))
  },

  validateToken(token) {
    try {
      const payload = JSON.parse(atob(token))
      return payload.exp > Date.now()
    } catch {
      return false
    }
  },

  setAuthToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  setCurrentUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(this.sanitizeUser(user)))
  },

  sanitizeUser(user) {
    const { password, ...sanitized } = user
    return sanitized
  },

  // Admin functions
  async getAllUsers() {
    await delay(300)
    return userData.map(user => this.sanitizeUser(user))
  },

  async deleteUser(userId) {
    await delay(250)
    const index = userData.findIndex(u => u.Id === parseInt(userId))
    if (index === -1) {
      throw new Error('Benutzer nicht gefunden')
    }
    
    const deleted = userData.splice(index, 1)[0]
    return this.sanitizeUser(deleted)
  }
}