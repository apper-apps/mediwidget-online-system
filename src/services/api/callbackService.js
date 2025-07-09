// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

export const callbackService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "phone" } },
          { field: { Name: "email" } },
          { field: { Name: "reason" } },
          { field: { Name: "message" } },
          { field: { Name: "status" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('callback', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching callbacks:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Rückruf-ID')
      }
      
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "phone" } },
          { field: { Name: "email" } },
          { field: { Name: "reason" } },
          { field: { Name: "message" } },
          { field: { Name: "status" } }
        ]
      }
      
      const response = await apperClient.getRecordById('callback', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching callback with ID ${id}:`, error)
      throw error
    }
  },

  async create(callbackInfo) {
    try {
      if (!callbackInfo.name || !callbackInfo.phone) {
        throw new Error('Name und Telefonnummer sind erforderlich')
      }
      
      const apperClient = getApperClient()
      const params = {
        records: [{
          Name: callbackInfo.name,
          Tags: callbackInfo.tags || '',
          Owner: callbackInfo.owner || null,
          phone: callbackInfo.phone,
          email: callbackInfo.email || '',
          reason: callbackInfo.reason || 'appointment',
          message: callbackInfo.message || '',
          status: 'pending'
        }]
      }
      
      const response = await apperClient.createRecord('callback', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create callback')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error creating callback:', error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Rückruf-ID')
      }
      
      const apperClient = getApperClient()
      const updateData = { Id: parseInt(id) }
      
      // Only include updateable fields
      if (updates.name !== undefined) updateData.Name = updates.name
      if (updates.tags !== undefined) updateData.Tags = updates.tags
      if (updates.owner !== undefined) updateData.Owner = updates.owner
      if (updates.phone !== undefined) updateData.phone = updates.phone
      if (updates.email !== undefined) updateData.email = updates.email
      if (updates.reason !== undefined) updateData.reason = updates.reason
      if (updates.message !== undefined) updateData.message = updates.message
      if (updates.status !== undefined) updateData.status = updates.status
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('callback', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update callback')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error updating callback:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Rückruf-ID')
      }
      
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('callback', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete callback')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error deleting callback:', error)
      throw error
    }
  },

  async getSettings() {
    try {
      // Mock implementation for callback settings
      // In real implementation, this would fetch from a settings table
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
    } catch (error) {
      console.error('Error getting callback settings:', error)
      throw error
    }
  },

  async updateSettings(settings) {
    try {
      // Mock implementation for updating callback settings
      // In real implementation, this would save to a settings table
      return { ...settings }
    } catch (error) {
      console.error('Error updating callback settings:', error)
      throw error
    }
  }
}