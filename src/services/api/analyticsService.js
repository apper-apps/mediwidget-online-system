// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const analyticsService = {
  async getAnalytics(timeRange = '7d', userId = null) {
    await delay(300)
    
    // Validate user access
    if (userId) {
      // In a real implementation, filter data by user/practice
      console.log(`Loading analytics for user ${userId}`)
    }
    
    // Mock data based on time range with enhanced error handling
    const mockData = {
      '24h': {
        totalViews: '247',
        conversions: '18',
        conversionRate: '7.3%',
        avgSessionDuration: '2:12'
      },
      '7d': {
        totalViews: '2,547',
        conversions: '189',
        conversionRate: '7.4%',
        avgSessionDuration: '2:34'
      },
      '30d': {
        totalViews: '12,847',
        conversions: '956',
        conversionRate: '7.4%',
        avgSessionDuration: '2:28'
      },
      '90d': {
        totalViews: '34,291',
        conversions: '2,547',
        conversionRate: '7.4%',
        avgSessionDuration: '2:41'
      }
    }
    
    const result = mockData[timeRange] || mockData['7d']
    if (!result) {
      throw new Error('Analytics-Daten konnten nicht geladen werden')
    }
    
    return result
  },

  async getInteractionStats() {
    await delay(250)
    return [
      { action: 'Termin vereinbaren', count: 145, percentage: 65 },
      { action: 'Rückruf anfordern', count: 89, percentage: 40 },
      { action: 'Öffnungszeiten anzeigen', count: 234, percentage: 85 },
      { action: 'Praxis-Informationen', count: 167, percentage: 55 },
      { action: 'Chat beendet', count: 45, percentage: 15 }
    ]
  },

  async getDeviceStats() {
    await delay(200)
    return [
      { device: 'Desktop', percentage: 45, count: 1147 },
      { device: 'Mobil', percentage: 42, count: 1070 },
      { device: 'Tablet', percentage: 13, count: 330 }
    ]
  },

async getRecentActivity(userId = null) {
    await delay(200)
    
    // Validate user access
    if (userId) {
      console.log(`Loading recent activity for user ${userId}`)
    }
    
    try {
      return [
        { 
          time: '14:25', 
          action: 'Termin vereinbart', 
          device: 'Desktop', 
          status: 'Erfolgreich',
          timestamp: new Date().toISOString()
        },
        { 
          time: '14:18', 
          action: 'Rückruf angefordert', 
          device: 'Mobil', 
          status: 'Erfolgreich',
          timestamp: new Date().toISOString()
        },
        { 
          time: '14:12', 
          action: 'Chatbot-Gespräch', 
          device: 'Tablet', 
          status: 'Abgebrochen',
          timestamp: new Date().toISOString()
        },
        { 
          time: '14:05', 
          action: 'Öffnungszeiten angezeigt', 
          device: 'Desktop', 
          status: 'Erfolgreich',
          timestamp: new Date().toISOString()
        },
        { 
          time: '13:58', 
          action: 'Praxis-Informationen', 
          device: 'Mobil', 
          status: 'Erfolgreich',
          timestamp: new Date().toISOString()
        }
      ]
    } catch (error) {
      throw new Error('Letzte Aktivitäten konnten nicht geladen werden')
    }
  }
}