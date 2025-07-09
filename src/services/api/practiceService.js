// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

export const practiceService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "logo" } },
          { field: { Name: "primary_color" } },
          { field: { Name: "secondary_color" } },
          { field: { Name: "contact_email" } },
          { field: { Name: "contact_phone" } },
          { field: { Name: "address" } },
          { field: { Name: "website" } },
          { field: { Name: "description" } },
          { field: { Name: "domain" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('practice', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching practices:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Praxis-ID')
      }
      
      const apperClient = getApperClient()
const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "logo" } },
          { field: { Name: "primary_color" } },
          { field: { Name: "secondary_color" } },
          { field: { Name: "contact_email" } },
          { field: { Name: "contact_phone" } },
          { field: { Name: "address" } },
          { field: { Name: "website" } },
          { field: { Name: "description" } },
          { field: { Name: "domain" } }
        ]
      }
      
      const response = await apperClient.getRecordById('practice', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching practice with ID ${id}:`, error)
      throw error
    }
  },

  async create(practiceInfo) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          Name: practiceInfo.name,
          Tags: practiceInfo.tags || '',
          Owner: practiceInfo.owner || null,
          logo: practiceInfo.logo || '',
          primary_color: practiceInfo.primaryColor || '#0066CC',
          secondary_color: practiceInfo.secondaryColor || '#E8F2FF',
          contact_email: practiceInfo.contactEmail || '',
          contact_phone: practiceInfo.contactPhone || '',
          address: practiceInfo.address || '',
          website: practiceInfo.website || '',
          description: practiceInfo.description || ''
        }]
      }
      
      const response = await apperClient.createRecord('practice', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create practice')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error creating practice:', error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Praxis-ID')
      }
      
      const apperClient = getApperClient()
      const updateData = { Id: parseInt(id) }
      
// Only include updateable fields
      if (updates.name !== undefined) updateData.Name = updates.name
      if (updates.tags !== undefined) updateData.Tags = updates.tags
      if (updates.owner !== undefined) updateData.Owner = updates.owner
      if (updates.logo !== undefined) updateData.logo = updates.logo
      if (updates.primaryColor !== undefined) updateData.primary_color = updates.primaryColor
      if (updates.secondaryColor !== undefined) updateData.secondary_color = updates.secondaryColor
      if (updates.contactEmail !== undefined) updateData.contact_email = updates.contactEmail
      if (updates.contactPhone !== undefined) updateData.contact_phone = updates.contactPhone
      if (updates.address !== undefined) updateData.address = updates.address
      if (updates.website !== undefined) updateData.website = updates.website
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.domain !== undefined) updateData.domain = updates.domain
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('practice', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update practice')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error updating practice:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Praxis-ID')
      }
      
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('practice', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete practice')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error deleting practice:', error)
      throw error
    }
  }
}