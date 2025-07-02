import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import { chatbotService } from '@/services/api/chatbotService'

const ChatbotBuilder = () => {
  const [chatbotFlow, setChatbotFlow] = useState({
    nodes: [],
    edges: [],
    startNodeId: null
  })
  const [selectedNode, setSelectedNode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadChatbotFlow = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await chatbotService.getFlow()
      if (data && data.nodes && data.nodes.length > 0) {
        setChatbotFlow(data)
      } else {
        // Initialize with default nodes
        const defaultFlow = {
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
        setChatbotFlow(defaultFlow)
      }
    } catch (err) {
      setError(err.message)
      toast.error('Fehler beim Laden des Chatbot-Flows')
    } finally {
      setLoading(false)
    }
  }

  const saveChatbotFlow = async () => {
    try {
      setSaving(true)
      
      await chatbotService.updateFlow(chatbotFlow)
      toast.success('Chatbot-Flow erfolgreich gespeichert')
    } catch (err) {
      toast.error('Fehler beim Speichern des Chatbot-Flows')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadChatbotFlow()
  }, [])

  const addNode = (type) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      title: type === 'greeting' ? 'Neue Begrüßung' : 'Neue Antwort',
      message: '',
      options: type === 'greeting' ? [{ id: 'opt1', text: '', nextNodeId: null }] : [],
      action: type === 'response' ? { type: 'none', label: '' } : null,
      position: { x: 100 + chatbotFlow.nodes.length * 50, y: 100 + chatbotFlow.nodes.length * 50 }
    }

    setChatbotFlow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }))
    setSelectedNode(newNode)
  }

  const updateNode = (nodeId, updates) => {
    setChatbotFlow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }))
    
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => ({ ...prev, ...updates }))
    }
  }

  const deleteNode = (nodeId) => {
    if (chatbotFlow.nodes.length <= 1) {
      toast.warning('Mindestens ein Knoten muss vorhanden sein')
      return
    }

    setChatbotFlow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      startNodeId: prev.startNodeId === nodeId ? prev.nodes[0]?.id : prev.startNodeId
    }))
    
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null)
    }
  }

  const addOption = (nodeId) => {
    const newOption = {
      id: `opt_${Date.now()}`,
      text: '',
      nextNodeId: null
    }

    updateNode(nodeId, {
      options: [...(chatbotFlow.nodes.find(n => n.id === nodeId)?.options || []), newOption]
    })
  }

  const updateOption = (nodeId, optionId, updates) => {
    const node = chatbotFlow.nodes.find(n => n.id === nodeId)
    if (!node) return

    const updatedOptions = node.options.map(option =>
      option.id === optionId ? { ...option, ...updates } : option
    )

    updateNode(nodeId, { options: updatedOptions })
  }

  const removeOption = (nodeId, optionId) => {
    const node = chatbotFlow.nodes.find(n => n.id === nodeId)
    if (!node || node.options.length <= 1) return

    const updatedOptions = node.options.filter(option => option.id !== optionId)
    updateNode(nodeId, { options: updatedOptions })
  }

  const templates = [
    {
      name: 'Hausarzt-Praxis',
      description: 'Standard-Flow für Hausarztpraxen',
      flow: {
        nodes: [
          {
            id: 'start',
            type: 'greeting',
            title: 'Begrüßung',
            message: 'Hallo! Ich bin der digitale Assistent Ihrer Hausarztpraxis. Wie kann ich Ihnen heute helfen?',
            options: [
              { id: 'opt1', text: '📅 Termin vereinbaren', nextNodeId: 'appointment' },
              { id: 'opt2', text: '📞 Rückruf anfordern', nextNodeId: 'callback' },
              { id: 'opt3', text: '💊 Rezept anfragen', nextNodeId: 'prescription' },
              { id: 'opt4', text: 'ℹ️ Öffnungszeiten', nextNodeId: 'hours' }
            ]
          }
        ]
      }
    },
    {
      name: 'Zahnarzt-Praxis',
      description: 'Spezieller Flow für Zahnarztpraxen',
      flow: {
        nodes: [
          {
            id: 'start',
            type: 'greeting',
            title: 'Begrüßung',
            message: 'Willkommen in unserer Zahnarztpraxis! Wie kann ich Ihnen behilflich sein?',
            options: [
              { id: 'opt1', text: '🦷 Termin vereinbaren', nextNodeId: 'appointment' },
              { id: 'opt2', text: '🚨 Notfall', nextNodeId: 'emergency' },
              { id: 'opt3', text: '📞 Rückruf anfordern', nextNodeId: 'callback' },
              { id: 'opt4', text: 'ℹ️ Leistungen', nextNodeId: 'services' }
            ]
          }
        ]
      }
    }
  ]

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadChatbotFlow} />
  }

  if (chatbotFlow.nodes.length === 0) {
    return (
      <Empty
        title="Kein Chatbot-Flow vorhanden"
        description="Erstellen Sie Ihren ersten Chatbot-Flow oder verwenden Sie eine Vorlage."
        icon="MessageSquare"
        action={() => addNode('greeting')}
        actionLabel="Ersten Knoten erstellen"
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">
            Chatbot-Builder
          </h1>
          <p className="text-surface-600">
            Erstellen Sie interaktive Gesprächsverläufe für Ihre Patienten
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            icon="FileText"
          >
            Vorlage laden
          </Button>
          <Button
            variant="primary"
            loading={saving}
            onClick={saveChatbotFlow}
            icon="Save"
          >
            Flow speichern
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Flow Canvas */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-surface-900">
                Gesprächsflow
              </h2>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon="MessageCircle"
                  onClick={() => addNode('greeting')}
                >
                  Begrüßung
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon="MessageSquare"
                  onClick={() => addNode('response')}
                >
                  Antwort
                </Button>
              </div>
            </div>
            
            <div className="relative min-h-96 bg-surface-50 rounded-lg p-4 overflow-auto">
              {/* Flow Nodes */}
              <div className="space-y-4">
                {chatbotFlow.nodes.map((node, index) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      flow-node p-4 relative
                      ${selectedNode?.id === node.id ? 'selected' : ''}
                      ${node.id === chatbotFlow.startNodeId ? 'ring-2 ring-accent-500' : ''}
                    `}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${node.type === 'greeting' ? 'bg-primary-100 text-primary-600' : 'bg-accent-100 text-accent-600'}
                        `}>
                          <ApperIcon 
                            name={node.type === 'greeting' ? 'MessageCircle' : 'MessageSquare'} 
                            size={16} 
                          />
                        </div>
                        <h3 className="font-semibold text-surface-900">{node.title}</h3>
                        {node.id === chatbotFlow.startNodeId && (
                          <span className="px-2 py-1 bg-accent-500 text-white text-xs rounded-full">
                            Start
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Star"
                          onClick={(e) => {
                            e.stopPropagation()
                            setChatbotFlow(prev => ({ ...prev, startNodeId: node.id }))
                          }}
                          className={`text-xs ${node.id === chatbotFlow.startNodeId ? 'text-accent-600' : 'text-surface-400'}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNode(node.id)
                          }}
                          className="text-red-600 hover:text-red-700 text-xs"
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-surface-700 mb-3 bg-white p-2 rounded border">
                      {node.message || 'Keine Nachricht'}
                    </p>
                    
                    {node.options && node.options.length > 0 && (
                      <div className="space-y-1">
                        {node.options.map((option) => (
                          <div 
                            key={option.id} 
                            className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded"
                          >
                            {option.text || 'Leere Option'}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {node.action && node.action.type !== 'none' && (
                      <div className="mt-2">
                        <div className="text-xs bg-accent-50 text-accent-700 px-2 py-1 rounded inline-block">
                          Aktion: {node.action.label || node.action.type}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Node Editor Sidebar */}
        <div className="lg:sticky lg:top-8">
          {selectedNode ? (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center">
                <ApperIcon name="Edit3" size={20} className="mr-2 text-primary-600" />
                Knoten bearbeiten
              </h3>
              
              <div className="space-y-4">
                <FormField
                  label="Titel"
                  value={selectedNode.title}
                  onChange={(value) => updateNode(selectedNode.id, { title: value })}
                  placeholder="Knoten-Titel"
                />
                
                <FormField
                  type="textarea"
                  label="Nachricht"
                  value={selectedNode.message}
                  onChange={(value) => updateNode(selectedNode.id, { message: value })}
                  placeholder="Nachricht an den Nutzer"
                  rows={4}
                />
                
                {selectedNode.type === 'greeting' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="form-label">Optionen</label>
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Plus"
                        onClick={() => addOption(selectedNode.id)}
                      >
                        Option
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedNode.options?.map((option, index) => (
                        <div key={option.id} className="p-3 border border-surface-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-surface-700">
                              Option {index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon="X"
                              onClick={() => removeOption(selectedNode.id, option.id)}
                              className="text-red-600 text-xs"
                            />
                          </div>
                          
                          <FormField
                            label="Button-Text"
                            value={option.text}
                            onChange={(value) => updateOption(selectedNode.id, option.id, { text: value })}
                            placeholder="z.B. Termin vereinbaren"
                            className="mb-2"
                          />
                          
                          <FormField
                            type="select"
                            label="Nächster Knoten"
                            value={option.nextNodeId || ''}
                            onChange={(value) => updateOption(selectedNode.id, option.id, { nextNodeId: value })}
                            options={[
                              { value: '', label: 'Kein Knoten' },
                              ...chatbotFlow.nodes
                                .filter(n => n.id !== selectedNode.id)
                                .map(n => ({ value: n.id, label: n.title }))
                            ]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedNode.type === 'response' && (
                  <div>
                    <label className="form-label">Aktion</label>
                    <FormField
                      type="select"
                      value={selectedNode.action?.type || 'none'}
                      onChange={(value) => updateNode(selectedNode.id, { 
                        action: { ...selectedNode.action, type: value } 
                      })}
                      options={[
                        { value: 'none', label: 'Keine Aktion' },
                        { value: 'appointment_form', label: 'Terminformular' },
                        { value: 'callback_form', label: 'Rückruf-Formular' },
                        { value: 'external_link', label: 'Externer Link' }
                      ]}
                    />
                    
                    {selectedNode.action?.type !== 'none' && (
                      <FormField
                        label="Button-Text"
                        value={selectedNode.action?.label || ''}
                        onChange={(value) => updateNode(selectedNode.id, { 
                          action: { ...selectedNode.action, label: value } 
                        })}
                        placeholder="z.B. Jetzt buchen"
                      />
                    )}
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center py-8 text-surface-600">
                <ApperIcon name="MousePointer" size={48} className="mx-auto mb-4 text-surface-400" />
                <p className="font-medium">Knoten auswählen</p>
                <p className="text-sm">Klicken Sie auf einen Knoten, um ihn zu bearbeiten</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Templates Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-surface-900 mb-6">
          Vorlagen
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.name} className="p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-surface-900 mb-2">
                {template.name}
              </h3>
              <p className="text-sm text-surface-600 mb-4">
                {template.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                icon="Download"
                onClick={() => {
                  setChatbotFlow(template.flow)
                  toast.success(`Vorlage "${template.name}" geladen`)
                }}
              >
                Vorlage laden
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default ChatbotBuilder