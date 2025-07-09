import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import { widgetService } from '@/services/api/widgetService'

const EmbedInstall = () => {
  const [embedCode, setEmbedCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('html')

  const loadEmbedCode = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const code = await widgetService.getEmbedCode()
      setEmbedCode(code)
    } catch (err) {
      setError(err.message)
      toast.error('Fehler beim Laden des Embed-Codes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmbedCode()
  }, [])

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Code erfolgreich kopiert!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Fehler beim Kopieren des Codes')
    }
  }

  const platforms = [
    {
      id: 'html',
      name: 'HTML/JavaScript',
      description: 'Für statische Websites und HTML-Seiten',
      icon: 'Code',
code: `<!-- MediWidget Pro - Footer optimiert -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widgets.mediwidget.pro/embed.js';
    script.setAttribute('data-widget-id', 'mw_00000001');
    script.setAttribute('data-practice-id', '1');
    script.setAttribute('data-position', 'bottom-right');
    script.onload = function() {
      console.log('MediWidget Pro geladen');
    };
    script.onerror = function() {
      console.error('MediWidget Pro: Widget konnte nicht geladen werden');
    };
    document.body.appendChild(script);
  })();
</script>`
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      description: 'Für WordPress-Websites',
      icon: 'Globe',
code: `// Fügen Sie diesen Code in Ihre functions.php ein:
function add_mediwidget_to_footer() {
    ?>
    <script>
      (function() {
        var script = document.createElement('script');
        script.src = 'https://widgets.mediwidget.pro/embed.js';
        script.setAttribute('data-widget-id', 'mw_00000001');
        script.setAttribute('data-practice-id', '1');
        script.setAttribute('data-position', 'bottom-right');
        script.async = true;
        script.onerror = function() {
          console.error('MediWidget Pro: Widget konnte nicht geladen werden');
        };
        document.body.appendChild(script);
      })();
    </script>
    <?php
}
add_action('wp_footer', 'add_mediwidget_to_footer');`
    },
    {
      id: 'react',
      name: 'React',
      description: 'Für React-Anwendungen',
      icon: 'Component',
code: `import { useEffect } from 'react';

const MediWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widgets.mediwidget.pro/embed.js';
    script.setAttribute('data-widget-id', 'YOUR_WIDGET_ID');
    script.setAttribute('data-practice-id', '1');
    script.onerror = function() {
      console.error('MediWidget Pro: Widget konnte nicht geladen werden');
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return <div id="mediwidget-container"></div>;
};

export default MediWidget;`
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Für Shopify-Stores',
      icon: 'ShoppingBag',
      code: `<!-- Fügen Sie diesen Code in theme.liquid vor </body> ein -->
<div id="mediwidget-container"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widgets.mediwidget.pro/embed.js';
    script.setAttribute('data-widget-id', 'YOUR_WIDGET_ID');
    script.setAttribute('data-practice-id', '1');
    document.head.appendChild(script);
  })();
</script>`
    }
  ]

  const installationSteps = [
    {
      step: 1,
      title: 'Code kopieren',
      description: 'Kopieren Sie den Embed-Code für Ihre Plattform',
      icon: 'Copy'
    },
    {
      step: 2,
      title: 'Code einfügen',
      description: 'Fügen Sie den Code in Ihre Website ein',
      icon: 'Code'
    },
    {
      step: 3,
      title: 'Testen',
      description: 'Überprüfen Sie, ob das Widget korrekt angezeigt wird',
      icon: 'CheckCircle'
    },
    {
      step: 4,
      title: 'Live gehen',
      description: 'Veröffentlichen Sie Ihre Website mit dem Widget',
      icon: 'Rocket'
    }
  ]

  const troubleshooting = [
    {
      problem: 'Widget wird nicht angezeigt',
      solution: 'Überprüfen Sie, ob der JavaScript-Code korrekt eingebunden ist und keine Konsolen-Fehler vorliegen.',
      icon: 'AlertCircle'
    },
    {
      problem: 'Widget lädt langsam',
      solution: 'Stellen Sie sicher, dass der Code am Ende der Seite, kurz vor </body>, eingefügt wird.',
      icon: 'Clock'
    },
    {
      problem: 'Formular funktioniert nicht',
      solution: 'Prüfen Sie die Netzwerk-Verbindung und ob die Widget-ID korrekt ist.',
      icon: 'Wifi'
    },
    {
      problem: 'Styling-Konflikte',
      solution: 'Das Widget verwendet isolierte Styles. Bei Problemen kontaktieren Sie den Support.',
      icon: 'Palette'
    }
  ]

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadEmbedCode} />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-surface-900 mb-2">
          Widget einbetten & installieren
        </h1>
        <p className="text-surface-600">
          Fügen Sie Ihr MediWidget Pro ganz einfach zu Ihrer Website hinzu
        </p>
      </motion.div>

      {/* Platform Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-surface-900 mb-6">
          Plattform auswählen
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {platforms.map((platform, index) => (
            <motion.button
              key={platform.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`
                p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md
                ${selectedPlatform === platform.id 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-surface-200 hover:border-primary-300'
                }
              `}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${selectedPlatform === platform.id 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-surface-100 text-surface-600'
                  }
                `}>
                  <ApperIcon name={platform.icon} size={20} />
                </div>
                <h3 className="font-semibold text-surface-900">{platform.name}</h3>
              </div>
              <p className="text-sm text-surface-600">{platform.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Code Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900">
              Embed-Code für {platforms.find(p => p.id === selectedPlatform)?.name}
            </h3>
            <Button
              variant={copied ? 'accent' : 'primary'}
              icon={copied ? 'Check' : 'Copy'}
              onClick={() => copyToClipboard(platforms.find(p => p.id === selectedPlatform)?.code)}
            >
              {copied ? 'Kopiert!' : 'Code kopieren'}
            </Button>
          </div>
          
          <div className="relative">
            <pre className="code-block overflow-x-auto">
              <code>{platforms.find(p => p.id === selectedPlatform)?.code}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Installation Steps */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
          <ApperIcon name="List" size={24} className="mr-3 text-primary-600" />
          Installations-Anleitung
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {installationSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name={step.icon} size={24} className="text-primary-600" />
              </div>
              <div className="mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-500 text-white rounded-full text-sm font-bold mb-2">
                  {step.step}
                </span>
              </div>
              <h3 className="font-semibold text-surface-900 mb-2">{step.title}</h3>
              <p className="text-sm text-surface-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Configuration Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Widget Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
            <ApperIcon name="Settings" size={24} className="mr-3 text-primary-600" />
            Widget-Konfiguration
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-surface-50 rounded-lg">
              <h4 className="font-medium text-surface-900 mb-2">Widget-ID</h4>
              <div className="flex items-center justify-between">
<code className="text-sm bg-white px-2 py-1 rounded border">
                  mw_00000001
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Copy"
                  onClick={() => copyToClipboard('mw_00000001')}
                />
              </div>
            </div>
            
            <div className="p-4 bg-surface-50 rounded-lg">
              <h4 className="font-medium text-surface-900 mb-2">Praxis-ID</h4>
              <div className="flex items-center justify-between">
                <code className="text-sm bg-white px-2 py-1 rounded border">1</code>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Copy"
                  onClick={() => copyToClipboard('1')}
                />
              </div>
            </div>
            
            <div className="p-4 bg-surface-50 rounded-lg">
<h4 className="font-medium text-surface-900 mb-2">Widget-URL</h4>
              <div className="flex items-center justify-between">
                <code className="text-sm bg-white px-2 py-1 rounded border truncate">
                  https://widgets.mediwidget.pro/embed.js
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Copy"
                  onClick={() => copyToClipboard('https://widgets.mediwidget.pro/embed.js')}
                />
              </div>
              <p className="text-xs text-surface-500 mt-2">
                Tipp: Konfigurieren Sie eine benutzerdefinierte Domain in den Praxis-Einstellungen für bessere Performance und Branding.
              </p>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
            <ApperIcon name="Eye" size={24} className="mr-3 text-primary-600" />
            Live-Vorschau
          </h2>
          
          <div className="bg-surface-50 rounded-lg p-4 text-center">
            <div className="inline-block bg-white rounded-lg shadow-lg p-4 max-w-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Stethoscope" size={16} className="text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-surface-900">Dr. Muster Praxis</h4>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    <span className="text-xs text-surface-600">Online</span>
                  </div>
                </div>
              </div>
              
              <div className="text-left space-y-2 mb-4">
                <p className="text-sm text-surface-700">
                  Hallo! Wie kann ich Ihnen helfen?
                </p>
                <div className="space-y-1">
                  <button className="w-full text-left text-xs text-primary-600 hover:text-primary-700 p-2 bg-primary-50 rounded">
                    📅 Termin vereinbaren
                  </button>
                  <button className="w-full text-left text-xs text-primary-600 hover:text-primary-700 p-2 bg-primary-50 rounded">
                    📞 Rückruf anfordern
                  </button>
                </div>
              </div>
              
              <button className="w-full py-2 px-4 bg-primary-500 text-white text-sm font-medium rounded-lg">
                Termin buchen
              </button>
            </div>
            
            <p className="text-sm text-surface-600 mt-4">
              So wird Ihr Widget auf der Website angezeigt
            </p>
          </div>
        </Card>
      </div>

      {/* Troubleshooting */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
          <ApperIcon name="HelpCircle" size={24} className="mr-3 text-primary-600" />
          Häufige Probleme & Lösungen
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {troubleshooting.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-surface-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name={item.icon} size={16} className="text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-surface-900 mb-2">{item.problem}</h4>
                  <p className="text-sm text-surface-600">{item.solution}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Info" size={20} className="text-primary-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary-900 mb-1">
                Benötigen Sie weitere Hilfe?
              </h4>
              <p className="text-sm text-primary-700 mb-3">
                Unser Support-Team hilft Ihnen gerne bei der Integration des Widgets.
              </p>
              <div className="flex items-center space-x-3">
                <Button variant="primary" size="sm" icon="Mail">
                  Support kontaktieren
                </Button>
                <Button variant="outline" size="sm" icon="Book">
                  Dokumentation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Testing Tools */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
          <ApperIcon name="TestTube" size={24} className="mr-3 text-primary-600" />
          Test-Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-surface-200 rounded-lg hover:border-primary-300 transition-colors">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Globe" size={24} className="text-primary-600" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-2">Website-Test</h3>
            <p className="text-sm text-surface-600 mb-4">
              Testen Sie Ihr Widget auf verschiedenen Geräten
            </p>
            <Button variant="outline" size="sm">
              Test starten
            </Button>
          </div>
          
          <div className="text-center p-6 border border-surface-200 rounded-lg hover:border-primary-300 transition-colors">
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Smartphone" size={24} className="text-accent-600" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-2">Mobile-Test</h3>
            <p className="text-sm text-surface-600 mb-4">
              Überprüfen Sie die mobile Darstellung
            </p>
            <Button variant="outline" size="sm">
              Mobil testen
            </Button>
          </div>
          
          <div className="text-center p-6 border border-surface-200 rounded-lg hover:border-primary-300 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-2">Funktions-Test</h3>
            <p className="text-sm text-surface-600 mb-4">
              Testen Sie alle Widget-Funktionen
            </p>
            <Button variant="outline" size="sm">
              Funktionen testen
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default EmbedInstall