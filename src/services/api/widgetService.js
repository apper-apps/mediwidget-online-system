// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

export const widgetService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "practice_id" } },
          { field: { Name: "embed_code" } },
          { field: { Name: "is_active" } },
          { field: { Name: "config" } }
        ]
      }
      
      const response = await apperClient.fetchRecords('widget', params)
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching widgets:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Widget-ID')
      }
      
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "practice_id" } },
          { field: { Name: "embed_code" } },
          { field: { Name: "is_active" } },
          { field: { Name: "config" } }
        ]
      }
      
      const response = await apperClient.getRecordById('widget', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching widget with ID ${id}:`, error)
      throw error
    }
  },

  async create(widgetInfo) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [{
          Name: widgetInfo.name || 'New Widget',
          Tags: widgetInfo.tags || '',
          Owner: widgetInfo.owner || null,
          practice_id: widgetInfo.practiceId || '1',
          embed_code: widgetInfo.embedCode || '',
          is_active: widgetInfo.isActive !== undefined ? widgetInfo.isActive : true,
          config: typeof widgetInfo.config === 'object' ? JSON.stringify(widgetInfo.config) : widgetInfo.config || '{}'
        }]
      }
      
      const response = await apperClient.createRecord('widget', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create widget')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error creating widget:', error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Widget-ID')
      }
      
      const apperClient = getApperClient()
      const updateData = { Id: parseInt(id) }
      
      // Only include updateable fields
      if (updates.name !== undefined) updateData.Name = updates.name
      if (updates.tags !== undefined) updateData.Tags = updates.tags
      if (updates.owner !== undefined) updateData.Owner = updates.owner
      if (updates.practiceId !== undefined) updateData.practice_id = updates.practiceId
      if (updates.embedCode !== undefined) updateData.embed_code = updates.embedCode
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive
      if (updates.config !== undefined) {
        updateData.config = typeof updates.config === 'object' ? JSON.stringify(updates.config) : updates.config
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('widget', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update widget')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error updating widget:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      if (!id || isNaN(parseInt(id))) {
        throw new Error('Ungültige Widget-ID')
      }
      
      const apperClient = getApperClient()
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('widget', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete widget')
        }
        return response.results[0].data
      }
      
      return response.data
    } catch (error) {
      console.error('Error deleting widget:', error)
      throw error
    }
  },

  async getStats(userId = null) {
    try {
      // Mock implementation for now - in real implementation, this would query analytics data
      const baseStats = {
        views: '2,547',
        appointments: '189',
        callbacks: '156',
        chats: '432',
        conversions: '189',
        conversionRate: '7.4%'
      }
      
      // Add some realistic daily variance
      const dailyMultiplier = 0.8 + (Math.random() * 0.4) // 0.8 to 1.2
      const todayViews = Math.floor(parseInt(baseStats.views.replace(/,/g, '')) * dailyMultiplier / 30)
      const todayConversions = Math.floor(parseInt(baseStats.conversions.replace(/,/g, '')) * dailyMultiplier / 30)
      
      const stats = {
        ...baseStats,
        todayViews: todayViews.toString(),
        todayConversions: todayConversions.toString()
      }
      
      return stats
    } catch (error) {
      throw new Error('Widget-Statistiken konnten nicht geladen werden: ' + error.message)
    }
  },

  async getEmbedCode(practiceId = 1) {
    try {
      if (!practiceId || isNaN(parseInt(practiceId))) {
        throw new Error('Ungültige Praxis-ID für Embed-Code')
      }
      
      // Generate stable widget ID based on practice ID
      const stableWidgetId = `mw_${practiceId.toString().padStart(8, '0')}`
      
// Try to get practice-specific domain configuration
      let widgetUrl = import.meta.env.VITE_WIDGET_CDN_URL || 'https://widgets.mediwidget.pro/embed.js'
      
      try {
        // Check if practice has custom domain configured
        const { practiceService } = await import('./practiceService')
        const practiceInfo = await practiceService.getById(practiceId)
        
        if (practiceInfo && practiceInfo.domain) {
          // Use custom domain if configured
          const customDomain = practiceInfo.domain.startsWith('http') 
            ? practiceInfo.domain 
            : `https://${practiceInfo.domain}`
          widgetUrl = `${customDomain}/embed.js`
        }
      } catch (error) {
        console.warn('Could not load practice domain configuration, using default CDN:', error)
      }
      
      return `<!-- MediWidget Pro -->
<div id="mediwidget-container"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${widgetUrl}';
    script.setAttribute('data-widget-id', '${stableWidgetId}');
    script.setAttribute('data-practice-id', '${practiceId}');
    script.setAttribute('data-project-id', '${import.meta.env.VITE_APPER_PROJECT_ID || ''}');
    script.onerror = function() {
      console.error('MediWidget Pro: Failed to load widget script from ${widgetUrl}');
    };
    document.head.appendChild(script);
  })();
</script>`
    } catch (error) {
      console.error('Error generating embed code:', error)
      throw error
    }
  },

  async getWidgetConfig(practiceId = 1) {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "practice_id" } },
          { field: { Name: "embed_code" } },
          { field: { Name: "is_active" } },
          { field: { Name: "config" } }
        ],
        where: [
          {
            FieldName: "practice_id",
            Operator: "EqualTo",
            Values: [practiceId.toString()]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('widget', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      const widget = response.data && response.data[0]
      if (!widget) {
        // Return default configuration if no specific widget found
        return {
          Id: 1,
          practiceId: practiceId.toString(),
          config: {
            showChatbot: true,
            showCallback: true,
            showAppointment: true,
            showOpeningHours: true,
            theme: 'light',
            position: 'bottom-right',
            size: 'medium',
            borderRadius: 'rounded',
            animation: 'slide',
            launcherMode: true,
            launcherText: 'Online Rezeption'
          },
          isActive: true
        }
      }
      
      // Parse config if it's a string
      if (typeof widget.config === 'string') {
        try {
          widget.config = JSON.parse(widget.config)
        } catch (e) {
          widget.config = {}
        }
      }
      
      return widget
    } catch (error) {
      console.error('Error getting widget config:', error)
      throw error
    }
  }
}