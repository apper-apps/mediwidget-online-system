/**
 * MediWidget Pro - External Widget Embed Script
 * This script is loaded by external websites to embed the MediWidget
 */

(function() {
  'use strict';

// Configuration
  const CONFIG = {
    apiBaseUrl: null, // Will be set dynamically based on practice domain
    widgetVersion: '1.0.0',
    maxRetries: 3,
    retryDelay: 1000,
    updateApiBaseUrl: function(domain) {
      this.apiBaseUrl = `https://${domain}`;
    }
  };

  // Global widget state
  let widgetInstance = null;
  let isInitialized = false;
  let currentScript = null;

// Find the script tag that loaded this file
  function findCurrentScript() {
    // Try multiple methods to find the script
    const scripts = document.getElementsByTagName('script');
    
    // Method 1: Look for embed.js in src
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.includes('embed.js')) {
        return scripts[i];
      }
    }
    
    // Method 2: Look for data-widget-id attribute (fallback)
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].hasAttribute('data-widget-id') || scripts[i].hasAttribute('data-practice-id')) {
        return scripts[i];
      }
    }
    
    // Method 3: Look for MediWidget in script content
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].innerHTML && scripts[i].innerHTML.includes('MediWidget')) {
        return scripts[i];
      }
    }
    
    console.warn('MediWidget Pro: Could not find script tag');
    return null;
  }

  // Extract configuration from script attributes
  function getScriptConfig(script) {
    if (!script) return {};
    
    return {
      widgetId: script.getAttribute('data-widget-id') || '',
      practiceId: script.getAttribute('data-practice-id') || '1',
      projectId: script.getAttribute('data-project-id') || '',
      position: script.getAttribute('data-position') || 'bottom-right',
      theme: script.getAttribute('data-theme') || 'light'
    };
  }

// Create widget container
  function createWidgetContainer() {
    let container = document.getElementById('mediwidget-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mediwidget-container';
      container.style.cssText = `
        position: fixed;
        z-index: 999999;
        pointer-events: none;
        font-family: Inter, system-ui, sans-serif;
      `;
      
      // Enhanced container attachment with multiple fallbacks
      const attachContainer = () => {
        if (document.body) {
          document.body.appendChild(container);
          console.log('MediWidget Pro: Container attached to body');
          return true;
        } else if (document.documentElement) {
          document.documentElement.appendChild(container);
          console.log('MediWidget Pro: Container attached to documentElement');
          return true;
        }
        return false;
      };
      
      // Try immediate attachment
      if (!attachContainer()) {
        // Fallback 1: Wait for DOMContentLoaded
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', attachContainer);
        } else {
          // Fallback 2: Use setTimeout for delayed attachment
          setTimeout(() => {
            if (!attachContainer()) {
              console.error('MediWidget Pro: Failed to attach container to DOM');
            }
          }, 100);
        }
      }
    }
    return container;
  }

  // Position widget based on configuration
  function positionWidget(container, position) {
    const positions = {
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
      'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    };

    const pos = positions[position] || positions['bottom-right'];
    Object.assign(container.style, pos);
  }

// Load widget configuration from API
  async function loadWidgetConfig(practiceId) {
    try {
      // Initialize ApperClient to fetch real practice data
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: window.VITE_APPER_PROJECT_ID || 'your-project-id',
        apperPublicKey: window.VITE_APPER_PUBLIC_KEY || 'your-public-key'
      });
      
      // Fetch practice information
      const practiceParams = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "primary_color" } },
          { field: { Name: "secondary_color" } },
          { field: { Name: "logo" } },
          { field: { Name: "domain" } }
        ]
      };
      
      const practiceResponse = await apperClient.getRecordById('practice', parseInt(practiceId), practiceParams);
      
      if (!practiceResponse.success) {
        throw new Error('Failed to load practice information');
      }
      
      const practiceData = practiceResponse.data;
      
      // Update CONFIG with the practice's domain
      if (practiceData.domain) {
        CONFIG.updateApiBaseUrl(practiceData.domain);
      }
      
      // Fetch opening hours
      const hoursParams = {
        fields: [
          { field: { Name: "day_of_week" } },
          { field: { Name: "open_time" } },
          { field: { Name: "close_time" } },
          { field: { Name: "is_closed" } }
        ],
        where: [
          { FieldName: "practice_id", Operator: "EqualTo", Values: [practiceId] }
        ]
      };
      
      const hoursResponse = await apperClient.fetchRecords('opening_hour', hoursParams);
      const openingHours = hoursResponse.success ? hoursResponse.data : [];
      
      // Transform opening hours to expected format
      const transformedHours = [];
      for (let i = 0; i <= 6; i++) {
        const dayData = openingHours.find(h => h.day_of_week === i);
        transformedHours.push({
          dayOfWeek: i,
          openTime: dayData ? dayData.open_time : '09:00',
          closeTime: dayData ? dayData.close_time : '17:00',
          isClosed: dayData ? dayData.is_closed : (i === 0) // Sunday closed by default
        });
      }
      
      return {
        practiceInfo: {
          name: practiceData.Name || 'Praxis',
          primaryColor: practiceData.primary_color || '#0066CC',
          secondaryColor: practiceData.secondary_color || '#E8F2FF',
          logo: practiceData.logo || null
        },
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
        openingHours: transformedHours
      };
    } catch (error) {
      console.error('MediWidget Pro: Failed to load configuration:', error);
      
      // Fallback to default configuration
      return {
        practiceInfo: {
          name: 'Praxis',
          primaryColor: '#0066CC',
          secondaryColor: '#E8F2FF',
          logo: null
        },
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
        openingHours: [
          { dayOfWeek: 1, openTime: '08:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 2, openTime: '08:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 3, openTime: '08:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 4, openTime: '08:00', closeTime: '17:00', isClosed: false },
          { dayOfWeek: 5, openTime: '08:00', closeTime: '15:00', isClosed: false },
          { dayOfWeek: 6, openTime: '09:00', closeTime: '12:00', isClosed: false },
          { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true }
        ]
      };
    }
  }

  // Create widget styles
  function createWidgetStyles() {
    const styleId = 'mediwidget-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* MediWidget Pro Styles */
      .mediwidget-widget {
        font-family: 'Inter', system-ui, sans-serif;
        box-sizing: border-box;
        pointer-events: auto;
        max-width: 400px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .mediwidget-widget * {
        box-sizing: border-box;
      }

      .mediwidget-launcher {
        background: var(--primary-color, #0066CC);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        transition: all 0.3s ease;
        pointer-events: auto;
      }

      .mediwidget-launcher:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
      }

      .mediwidget-header {
        padding: 16px 20px;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
      }

      .mediwidget-content {
        padding: 20px;
        background: white;
        max-height: 500px;
        overflow-y: auto;
      }

      .mediwidget-close {
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
        transition: all 0.2s ease;
      }

      .mediwidget-close:hover {
        background: #f1f5f9;
        color: #334155;
      }

      .mediwidget-button {
        width: 100%;
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .mediwidget-button.primary {
        background: var(--primary-color, #0066CC);
        color: white;
      }

      .mediwidget-button.primary:hover {
        background: var(--primary-hover, #0052a3);
        transform: translateY(-1px);
      }

      .mediwidget-button.secondary {
        background: #f8fafc;
        color: #475569;
        border: 1px solid #e2e8f0;
      }

      .mediwidget-button.secondary:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }

      .mediwidget-status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #64748b;
      }

      .mediwidget-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
      }

      .mediwidget-hours {
        background: #f8fafc;
        padding: 12px;
        border-radius: 8px;
        margin: 16px 0;
      }

      .mediwidget-hours h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
        color: #334155;
      }

      .mediwidget-hours-item {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #64748b;
        margin-bottom: 4px;
      }

      .mediwidget-chat {
        margin-bottom: 16px;
      }

      .mediwidget-message {
        background: #f8fafc;
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 8px;
        font-size: 14px;
        color: #334155;
      }

      @media (max-width: 768px) {
        .mediwidget-widget {
          max-width: 300px;
        }
        
        .mediwidget-content {
          padding: 16px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // Create widget HTML
  function createWidgetHTML(config) {
    const { practiceInfo, config: widgetConfig, openingHours } = config;
    
    // Get current status
    const now = new Date();
    const today = now.getDay();
    const todayHours = openingHours.find(h => h.dayOfWeek === today);
    const isOpen = todayHours && !todayHours.isClosed;

    const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const todayName = weekdays[today];

    return `
      <div class="mediwidget-widget" style="--primary-color: ${practiceInfo.primaryColor}; --primary-hover: ${practiceInfo.primaryColor}dd;">
        <div class="mediwidget-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, ${practiceInfo.primaryColor}, ${practiceInfo.primaryColor}dd); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">
              ${practiceInfo.name.charAt(0)}
            </div>
            <div>
              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">${practiceInfo.name}</h3>
              <div class="mediwidget-status">
                <div class="mediwidget-status-dot" style="background: ${isOpen ? '#10b981' : '#64748b'};"></div>
                <span>${isOpen ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
          <button class="mediwidget-close" onclick="MediWidget.close()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="mediwidget-content">
          ${widgetConfig.showChatbot ? `
            <div class="mediwidget-chat">
              <div class="mediwidget-message">
                Hallo! Wie kann ich Ihnen heute helfen?
              </div>
            </div>
          ` : ''}
          
          ${widgetConfig.showOpeningHours ? `
            <div class="mediwidget-hours">
              <h4>Öffnungszeiten</h4>
              ${openingHours.slice(1).concat(openingHours.slice(0, 1)).map((hours, index) => {
                const day = weekdays[(index + 1) % 7];
                const isToday = day === todayName;
                return `
                  <div class="mediwidget-hours-item" style="font-weight: ${isToday ? '600' : '400'}; color: ${isToday ? practiceInfo.primaryColor : '#64748b'};">
                    <span>${day}:</span>
                    <span>${hours.isClosed ? 'Geschlossen' : `${hours.openTime} - ${hours.closeTime}`}</span>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}
          
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${widgetConfig.showAppointment ? `
              <button class="mediwidget-button primary" onclick="MediWidget.handleAppointment()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Termin vereinbaren
              </button>
            ` : ''}
            
            ${widgetConfig.showCallback ? `
              <button class="mediwidget-button secondary" onclick="MediWidget.handleCallback()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Rückruf anfordern
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // Create launcher button
  function createLauncherHTML(config) {
    const { practiceInfo, config: widgetConfig } = config;
    
    return `
      <button class="mediwidget-launcher" onclick="MediWidget.open()" style="--primary-color: ${practiceInfo.primaryColor};">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        ${widgetConfig.launcherText || 'Online Rezeption'}
      </button>
    `;
  }

  // Widget class
  class MediWidget {
    constructor(config) {
      this.config = config;
      this.container = null;
      this.isOpen = false;
      this.scriptConfig = getScriptConfig(currentScript);
    }
init() {
      this.container = createWidgetContainer();
      
      // Enhanced positioning with footer compatibility
      if (this.container) {
        positionWidget(this.container, this.scriptConfig.position || this.config.config.position);
        
        // Ensure proper positioning for footer placement
        this.container.style.position = 'fixed';
        this.container.style.zIndex = '999999';
        
        // Add footer-specific styling
        this.container.style.display = 'block';
        this.container.style.visibility = 'visible';
        
        console.log('MediWidget Pro: Container positioned successfully');
      } else {
        console.error('MediWidget Pro: Failed to create container');
        return;
      }
      
      // Start with launcher if in launcher mode
      if (this.config.config.launcherMode) {
        this.renderLauncher();
      } else {
        this.renderWidget();
      }
      
      // Set up global methods
      window.MediWidget = {
        open: () => this.open(),
        close: () => this.close(),
        handleAppointment: () => this.handleAppointment(),
        handleCallback: () => this.handleCallback()
      };
}

    renderLauncher() {
      if (!this.container) return;
      this.container.innerHTML = createLauncherHTML(this.config);
      this.container.style.pointerEvents = 'auto';
      this.isOpen = false;
    }

    renderWidget() {
      if (!this.container) return;
      this.container.innerHTML = createWidgetHTML(this.config);
      this.isOpen = true;
    }

    open() {
      this.renderWidget();
      
      // Add animation
      const widget = this.container.querySelector('.mediwidget-widget');
      if (widget) {
        widget.style.opacity = '0';
        widget.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
          widget.style.transition = 'all 0.3s ease';
          widget.style.opacity = '1';
          widget.style.transform = 'translateY(0)';
        });
      }
    }

    close() {
      const widget = this.container.querySelector('.mediwidget-widget');
      if (widget) {
        widget.style.opacity = '0';
        widget.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          this.renderLauncher();
        }, 300);
      }
    }

    handleAppointment() {
      // In a real implementation, this would open a booking interface
      console.log('MediWidget: Appointment booking requested');
      alert('Terminbuchung würde hier geöffnet werden.\n\nIn der Vollversion würde hier ein Terminbuchungsformular oder eine Weiterleitung zu Ihrem Buchungssystem erfolgen.');
    }

    handleCallback() {
      // In a real implementation, this would open a callback form
      console.log('MediWidget: Callback requested');
      alert('Rückruf-Anfrage würde hier geöffnet werden.\n\nIn der Vollversion würde hier ein Formular für Rückruf-Anfragen angezeigt werden.');
    }
  }

// Initialize widget with retry logic
// Initialize widget with retry logic
  async function initializeWidget(retryCount = 0) {
    if (isInitialized) return;
    
    const maxRetries = 3;
    const retryDelay = 1000;
    
    try {
      console.log(`MediWidget Pro: Initializing... (attempt ${retryCount + 1})`);
      
      currentScript = findCurrentScript();
      const scriptConfig = getScriptConfig(currentScript);
      
      if (!scriptConfig.practiceId) {
        console.error('MediWidget Pro: Missing practice ID');
        if (retryCount < maxRetries) {
          console.log(`MediWidget Pro: Retrying in ${retryDelay}ms...`);
          setTimeout(() => initializeWidget(retryCount + 1), retryDelay);
        }
        return;
      }

      // Create styles
      createWidgetStyles();
      
      // Load configuration (this will also set the correct domain)
      const config = await loadWidgetConfig(scriptConfig.practiceId);
      
      // Log the API base URL being used
      console.log('MediWidget Pro: Using API base URL:', CONFIG.apiBaseUrl);
      
      // Create widget instance
      widgetInstance = new MediWidget(config);
      widgetInstance.init();
      
      isInitialized = true;
      console.log('MediWidget Pro: Successfully initialized');
      
    } catch (error) {
      console.error('MediWidget Pro: Initialization failed:', error);
      
      if (retryCount < maxRetries) {
        console.log(`MediWidget Pro: Retrying in ${retryDelay}ms...`);
        setTimeout(() => initializeWidget(retryCount + 1), retryDelay);
      } else {
        console.error('MediWidget Pro: Max retries exceeded, initialization failed');
      }
    }
  }
// Enhanced auto-initialization for footer compatibility
  function startInitialization() {
    console.log('MediWidget Pro: Starting initialization...');
    
    // Multiple initialization strategies for footer placement
    if (document.readyState === 'loading') {
      // Strategy 1: Wait for DOMContentLoaded
      document.addEventListener('DOMContentLoaded', () => {
        console.log('MediWidget Pro: DOM loaded, initializing...');
        setTimeout(initializeWidget, 100);
      });
    } else if (document.readyState === 'interactive') {
      // Strategy 2: DOM is interactive, slight delay
      setTimeout(() => {
        console.log('MediWidget Pro: DOM interactive, initializing...');
        initializeWidget();
      }, 200);
    } else {
      // Strategy 3: DOM is complete
      console.log('MediWidget Pro: DOM complete, initializing...');
      setTimeout(initializeWidget, 100);
    }
    
    // Strategy 4: Fallback initialization after longer delay
    setTimeout(() => {
      if (!isInitialized) {
        console.log('MediWidget Pro: Fallback initialization...');
        initializeWidget();
      }
    }, 2000);
  }

  // Start initialization immediately
  startInitialization();
  // Export for manual initialization if needed
  window.MediWidgetEmbed = {
    init: initializeWidget,
    version: CONFIG.widgetVersion
  };

})();