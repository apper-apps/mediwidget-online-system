import callbackData from '@/services/mockData/callbacks.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const callbackService = {
  async getAll() {
    await delay(300)
    return [...callbackData]
  },

  async getById(id) {
    await delay(200)
    const callback = callbackData.find(c => c.Id === parseInt(id))
    if (!callback) {
      throw new Error('Rückruf-Anfrage nicht gefunden')
    }
    return { ...callback }
  },

  async create(callbackInfo) {
    await delay(400)
    const newId = Math.max(...callbackData.map(c => c.Id)) + 1
    const newCallback = {
      Id: newId,
      ...callbackInfo,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    callbackData.push(newCallback)
    return { ...newCallback }
  },

  async update(id, updates) {
    await delay(350)
    const index = callbackData.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Rückruf-Anfrage nicht gefunden')
    }
    
    callbackData[index] = {
      ...callbackData[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...callbackData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = callbackData.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Rückruf-Anfrage nicht gefunden')
    }
    
    const deleted = callbackData.splice(index, 1)[0]
    return { ...deleted }
  },

  async getSettings() {
    await delay(200)
    return {
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
      notificationEmail: 'praxis@beispiel.de',
      confirmationMessage: 'Vielen Dank für Ihre Anfrage! Wir rufen Sie in Kürze zurück.',
      autoReply: true,
      priorityHandling: true
    }
  },

  async updateSettings(settings) {
    await delay(400)
    // In real implementation, this would save to database
    return { ...settings }
  }
}