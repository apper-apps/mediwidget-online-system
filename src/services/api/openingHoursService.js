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
    const index = openingHoursData.findIndex(h => h.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Öffnungszeiten nicht gefunden')
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