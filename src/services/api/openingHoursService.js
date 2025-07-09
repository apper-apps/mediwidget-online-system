// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

export const openingHoursService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "day_of_week" } },
          { field: { Name: "open_time" } },
          { field: { Name: "close_time" } },
          { field: { Name: "is_closed" } },
          { field: { Name: "breaks" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('opening_hour', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching opening hours:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Öffnungszeiten-ID')
      }
      
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "day_of_week" } },
          { field: { Name: "open_time" } },
          { field: { Name: "close_time" } },
          { field: { Name: "is_closed" } },
          { field: { Name: "breaks" } }
        ]
      }
      
      const response = await apperClient.getRecordById('opening_hour', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching opening hour with ID ${id}:`, error)
      throw error
    }
  },

  async create(hoursInfo) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          Name: hoursInfo.name || `Opening Hours ${hoursInfo.dayOfWeek}`,
          Tags: hoursInfo.tags || '',
          Owner: hoursInfo.owner || null,
          day_of_week: hoursInfo.dayOfWeek,
          open_time: hoursInfo.openTime || '',
          close_time: hoursInfo.closeTime || '',
          is_closed: hoursInfo.isClosed || false,
          breaks: typeof hoursInfo.breaks === 'object' ? JSON.stringify(hoursInfo.breaks) : hoursInfo.breaks || ''
        }]
      }
      
      const response = await apperClient.createRecord('opening_hour', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create opening hours')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error creating opening hours:', error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Öffnungszeiten-ID')
      }
      
      const apperClient = getApperClient()
      const updateData = { Id: parseInt(id) }
      
      // Only include updateable fields
      if (updates.name !== undefined) updateData.Name = updates.name
      if (updates.tags !== undefined) updateData.Tags = updates.tags
      if (updates.owner !== undefined) updateData.Owner = updates.owner
      if (updates.dayOfWeek !== undefined) updateData.day_of_week = updates.dayOfWeek
      if (updates.openTime !== undefined) updateData.open_time = updates.openTime
      if (updates.closeTime !== undefined) updateData.close_time = updates.closeTime
      if (updates.isClosed !== undefined) updateData.is_closed = updates.isClosed
      if (updates.breaks !== undefined) {
        updateData.breaks = typeof updates.breaks === 'object' ? JSON.stringify(updates.breaks) : updates.breaks
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('opening_hour', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update opening hours')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error updating opening hours:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Öffnungszeiten-ID')
      }
      
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('opening_hour', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete opening hours')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error deleting opening hours:', error)
      throw error
    }
  }
}