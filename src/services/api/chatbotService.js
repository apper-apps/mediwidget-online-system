import chatbotData from '@/services/mockData/chatbots.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const chatbotService = {
  async getAll() {
    await delay(300)
    return [...chatbotData]
  },

  async getById(id) {
    await delay(200)
    const chatbot = chatbotData.find(c => c.Id === parseInt(id))
    if (!chatbot) {
      throw new Error('Chatbot nicht gefunden')
    }
    return { ...chatbot }
  },

  async create(chatbotInfo) {
    await delay(400)
    const newId = Math.max(...chatbotData.map(c => c.Id)) + 1
    const newChatbot = {
      Id: newId,
      ...chatbotInfo,
      createdAt: new Date().toISOString()
    }
    chatbotData.push(newChatbot)
    return { ...newChatbot }
  },

  async update(id, updates) {
    await delay(350)
    const index = chatbotData.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Chatbot nicht gefunden')
    }
    
    chatbotData[index] = {
      ...chatbotData[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...chatbotData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = chatbotData.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Chatbot nicht gefunden')
    }
    
    const deleted = chatbotData.splice(index, 1)[0]
    return { ...deleted }
  },

  async getFlow() {
    await delay(200)
    return {
      nodes: [
        {
          id: 'start',
          type: 'greeting',
          title: 'Begrüßung',
          message: 'Hallo! Wie kann ich Ihnen helfen?',
          options: [
            { id: 'opt1', text: '📅 Termin vereinbaren', nextNodeId: 'appointment' },
            { id: 'opt2', text: '📞 Rückruf anfordern', nextNodeId: 'callback' },
            { id: 'opt3', text: 'ℹ️ Praxis-Informationen', nextNodeId: 'info' }
          ],
          position: { x: 100, y: 100 }
        },
        {
          id: 'appointment',
          type: 'response',
          title: 'Terminvereinbarung',
          message: 'Gerne helfe ich Ihnen bei der Terminvereinbarung. Bitte klicken Sie auf den Button unten, um einen Termin zu buchen.',
          action: { type: 'appointment_form', label: 'Termin buchen' },
          position: { x: 350, y: 50 }
        },
        {
          id: 'callback',
          type: 'response',
          title: 'Rückruf',
          message: 'Wir rufen Sie gerne zurück. Bitte füllen Sie das Formular aus.',
          action: { type: 'callback_form', label: 'Rückruf anfordern' },
          position: { x: 350, y: 150 }
        },
        {
          id: 'info',
          type: 'response',
          title: 'Praxis-Informationen',
          message: 'Unsere Praxis ist von Montag bis Freitag von 8:00 bis 18:00 Uhr geöffnet. Sie finden uns in der Musterstraße 123.',
          options: [
            { id: 'opt1', text: 'Weitere Fragen', nextNodeId: 'start' },
            { id: 'opt2', text: 'Termin vereinbaren', nextNodeId: 'appointment' }
          ],
          position: { x: 350, y: 250 }
        }
      ],
      edges: [],
      startNodeId: 'start'
    }
  },

  async updateFlow(flow) {
    await delay(400)
    // In real implementation, this would save to database
    return { ...flow }
  }
}