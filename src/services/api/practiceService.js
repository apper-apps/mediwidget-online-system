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
    const index = practiceData.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Praxis nicht gefunden')
    }
    
    practiceData[index] = {
      ...practiceData[index],
      ...updates,
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