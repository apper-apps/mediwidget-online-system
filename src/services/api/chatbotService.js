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

async getFlow(practiceId = null) {
    await delay(200)
    
    try {
      // In a real implementation, load practice-specific flow
      if (practiceId) {
        console.log(`Loading chatbot flow for practice ${practiceId}`)
      }
      
      const flow = {
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
      
      // Validate flow structure
      if (!flow.nodes || flow.nodes.length === 0) {
        throw new Error('Ungültiger Chatbot-Flow: Keine Knoten gefunden')
      }
      
      if (!flow.startNodeId) {
        throw new Error('Ungültiger Chatbot-Flow: Kein Startknoten definiert')
      }
      
      return flow
    } catch (error) {
      throw new Error('Chatbot-Flow konnte nicht geladen werden: ' + error.message)
    }
  },

async updateFlow(flow, practiceId = null) {
    await delay(400)
    
    if (!flow || !flow.nodes) {
      throw new Error('Ungültiger Flow: Knoten sind erforderlich')
    }
    
    if (!flow.startNodeId) {
      throw new Error('Ungültiger Flow: Startknoten ist erforderlich')
    }
    
    // Validate that start node exists
    const startNode = flow.nodes.find(node => node.id === flow.startNodeId)
    if (!startNode) {
      throw new Error('Startknoten nicht in der Knotenliste gefunden')
    }
    
    // In real implementation, this would save to database with practiceId
    if (practiceId) {
      console.log(`Saving chatbot flow for practice ${practiceId}`)
    }
    
    return { ...flow }
  }
}