import practiceData from '@/services/mockData/practices.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const practiceService = {
  async getAll() {
    await delay(300)
    return [...practiceData]
  },

async getById(id) {
    await delay(200)
    
    if (!id || isNaN(parseInt(id))) {
      throw new Error('Ungültige Praxis-ID')
    }
    
    const practice = practiceData.find(p => p.Id === parseInt(id))
    if (!practice) {
      throw new Error('Praxis nicht gefunden')
    }
    return { ...practice }
  },

  async create(practiceInfo) {
    await delay(400)
    const newId = Math.max(...practiceData.map(p => p.Id)) + 1
    const newPractice = {
      Id: newId,
      ...practiceInfo,
      createdAt: new Date().toISOString()
    }
    practiceData.push(newPractice)
    return { ...newPractice }
  },

async update(id, updates) {
    await delay(350)
    
    if (!id || isNaN(parseInt(id))) {
      throw new Error('Ungültige Praxis-ID')
    }
    
    const index = practiceData.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Praxis nicht gefunden')
    }
    
    // Validate required fields if provided
    if (updates.name && updates.name.trim().length < 2) {
      throw new Error('Praxis-Name muss mindestens 2 Zeichen lang sein')
    }
    
    // Validate color values if provided
    if (updates.primaryColor && !updates.primaryColor.match(/^#[0-9A-F]{6}$/i)) {
      throw new Error('Ungültiger Farbwert für Primärfarbe')
    }
    
    // Filter out empty or undefined values to preserve existing data
    const filteredUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    }, {})
    
    practiceData[index] = {
      ...practiceData[index],
      ...filteredUpdates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...practiceData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = practiceData.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Praxis nicht gefunden')
    }
    
    const deleted = practiceData.splice(index, 1)[0]
    return { ...deleted }
  }
}