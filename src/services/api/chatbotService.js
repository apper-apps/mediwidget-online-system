// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

export const chatbotService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "type" } },
          { field: { Name: "flows" } },
          { field: { Name: "settings" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('chatbot', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching chatbots:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Chatbot-ID')
      }
      
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "type" } },
          { field: { Name: "flows" } },
          { field: { Name: "settings" } }
        ]
      }
      
      const response = await apperClient.getRecordById('chatbot', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching chatbot with ID ${id}:`, error)
      throw error
    }
  },

  async create(chatbotInfo) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          Name: chatbotInfo.name || 'New Chatbot',
          Tags: chatbotInfo.tags || '',
          Owner: chatbotInfo.owner || null,
          description: chatbotInfo.description || '',
          status: chatbotInfo.status || 'draft',
          type: chatbotInfo.type || 'general',
          flows: typeof chatbotInfo.flows === 'object' ? JSON.stringify(chatbotInfo.flows) : chatbotInfo.flows || '',
          settings: typeof chatbotInfo.settings === 'object' ? JSON.stringify(chatbotInfo.settings) : chatbotInfo.settings || ''
        }]
      }
      
      const response = await apperClient.createRecord('chatbot', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create chatbot')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error creating chatbot:', error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Chatbot-ID')
      }
      
      const apperClient = getApperClient()
      const updateData = { Id: parseInt(id) }
      
      // Only include updateable fields
      if (updates.name !== undefined) updateData.Name = updates.name
      if (updates.tags !== undefined) updateData.Tags = updates.tags
      if (updates.owner !== undefined) updateData.Owner = updates.owner
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.type !== undefined) updateData.type = updates.type
      if (updates.flows !== undefined) {
        updateData.flows = typeof updates.flows === 'object' ? JSON.stringify(updates.flows) : updates.flows
      }
      if (updates.settings !== undefined) {
        updateData.settings = typeof updates.settings === 'object' ? JSON.stringify(updates.settings) : updates.settings
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('chatbot', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update chatbot')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error updating chatbot:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Chatbot-ID')
      }
      
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('chatbot', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete chatbot')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error deleting chatbot:', error)
      throw error
    }
  },

  async getFlow(practiceId = null) {
    try {
      // Mock implementation for now - in real implementation, this would fetch from database
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
      console.error('Error getting chatbot flow:', error)
      throw error
    }
  },

  async updateFlow(flow, practiceId = null) {
    try {
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
    } catch (error) {
      console.error('Error updating chatbot flow:', error)
      throw error
    }
  }
}