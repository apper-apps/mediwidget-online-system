import widgetData from '@/services/mockData/widgets.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const widgetService = {
  async getAll() {
    await delay(300)
    return [...widgetData]
  },

  async getById(id) {
    await delay(200)
    const widget = widgetData.find(w => w.Id === parseInt(id))
    if (!widget) {
      throw new Error('Widget nicht gefunden')
    }
    return { ...widget }
  },

  async create(widgetInfo) {
    await delay(400)
    const newId = Math.max(...widgetData.map(w => w.Id)) + 1
    const newWidget = {
      Id: newId,
      ...widgetInfo,
      embedCode: `<script src="https://widgets.mediwidget.pro/embed.js" data-widget-id="${newId}"></script>`,
      createdAt: new Date().toISOString()
    }
    widgetData.push(newWidget)
    return { ...newWidget }
  },

  async update(id, updates) {
    await delay(350)
    const index = widgetData.findIndex(w => w.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Widget nicht gefunden')
    }
// Validate config if provided
    if (updates.config) {
      // Ensure launcher settings are preserved
      if (updates.config.launcherMode !== undefined) {
        updates.config.launcherText = updates.config.launcherText || 'Online Rezeption'
      }
    }
    
    widgetData[index] = {
      ...widgetData[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...widgetData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = widgetData.findIndex(w => w.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Widget nicht gefunden')
    }
    
    const deleted = widgetData.splice(index, 1)[0]
    return { ...deleted }
  },

async getStats(userId = null) {
    await delay(200)
    
    try {
      // In a real implementation, filter stats by user/practice
      if (userId) {
        console.log(`Loading widget stats for user ${userId}`)
      }
      
      const stats = {
        views: '2,547',
        appointments: '189',
        callbacks: '156',
        chats: '432',
        conversions: '189',
        conversionRate: '7.4%'
      }
      
      // Validate that all required stats are present
      if (!stats.views || !stats.appointments) {
        throw new Error('Unvollständige Widget-Statistiken')
      }
      
      return stats
    } catch (error) {
      throw new Error('Widget-Statistiken konnten nicht geladen werden: ' + error.message)
    }
  },

async getEmbedCode(practiceId = 1) {
    await delay(150)
    
    if (!practiceId || isNaN(parseInt(practiceId))) {
      throw new Error('Ungültige Praxis-ID für Embed-Code')
    }
    
    return `<!-- MediWidget Pro -->
<div id="mediwidget-container"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widgets.mediwidget.pro/embed.js';
    script.setAttribute('data-widget-id', 'widget_${practiceId}');
    script.setAttribute('data-practice-id', '${practiceId}');
    document.head.appendChild(script);
  })();
</script>`
  }
}