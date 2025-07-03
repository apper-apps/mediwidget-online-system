import openingHoursData from '@/services/mockData/openingHours.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const openingHoursService = {
  async getAll() {
    await delay(200)
    return [...openingHoursData]
  },

  async getById(id) {
    await delay(150)
    
    if (!id || isNaN(parseInt(id))) {
      throw new Error('Ungültige Öffnungszeiten-ID')
    }
    
    const hours = openingHoursData.find(h => h.Id === parseInt(id))
    if (!hours) {
      throw new Error('Öffnungszeiten nicht gefunden')
    }
    return { ...hours }
  },

  async create(hoursInfo) {
    await delay(300)
    const newId = Math.max(...openingHoursData.map(h => h.Id)) + 1
    const newHours = {
      Id: newId,
      ...hoursInfo,
      createdAt: new Date().toISOString()
    }
    openingHoursData.push(newHours)
    return { ...newHours }
  },

  async update(id, updates) {
    await delay(250)
    
    if (!id || isNaN(parseInt(id))) {
      throw new Error('Ungültige Öffnungszeiten-ID')
    }
    
    const index = openingHoursData.findIndex(h => h.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Öffnungszeiten nicht gefunden')
    }
    
    // Validate time format if provided
    if (updates.openTime && !updates.openTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      throw new Error('Ungültiges Öffnungszeit-Format (HH:MM erwartet)')
    }
    
    if (updates.closeTime && !updates.closeTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      throw new Error('Ungültiges Schließzeit-Format (HH:MM erwartet)')
    }
    
    openingHoursData[index] = {
      ...openingHoursData[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...openingHoursData[index] }
  },

  async delete(id) {
    await delay(200)
    const index = openingHoursData.findIndex(h => h.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Öffnungszeiten nicht gefunden')
    }
    
    const deleted = openingHoursData.splice(index, 1)[0]
    return { ...deleted }
  }
}