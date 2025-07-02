import openingHoursData from '@/services/mockData/openingHours.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const openingHoursService = {
  async getAll() {
    await delay(300)
    return [...openingHoursData]
  },

  async getById(id) {
    await delay(200)
    const hours = openingHoursData.find(h => h.Id === parseInt(id))
    if (!hours) {
      throw new Error('Öffnungszeiten nicht gefunden')
    }
    return { ...hours }
  },

async create(hoursInfo) {
    await delay(400)
    
    if (!hoursInfo.practiceId) {
      throw new Error('Praxis-ID ist erforderlich')
    }
    
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
    await delay(350)
    
    if (!id || isNaN(parseInt(id))) {
      throw new Error('Ungültige Öffnungszeiten-ID')
    }
    
    const index = openingHoursData.findIndex(h => h.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Öffnungszeiten nicht gefunden')
    }
    
    // Validate hours format if provided
    if (updates.hours) {
      const validTimeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      Object.values(updates.hours).forEach(dayHours => {
        if (dayHours.open && !validTimeFormat.test(dayHours.open)) {
          throw new Error('Ungültiges Zeitformat für Öffnung')
        }
        if (dayHours.close && !validTimeFormat.test(dayHours.close)) {
          throw new Error('Ungültiges Zeitformat für Schließung')
        }
      })
    }
    
    openingHoursData[index] = {
      ...openingHoursData[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...openingHoursData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = openingHoursData.findIndex(h => h.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Öffnungszeiten nicht gefunden')
    }
    
    const deleted = openingHoursData.splice(index, 1)[0]
    return { ...deleted }
  }
}