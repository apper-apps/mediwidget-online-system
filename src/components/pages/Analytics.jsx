import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import StatsCard from '@/components/molecules/StatsCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import { analyticsService } from '@/services/api/analyticsService'

const Analytics = () => {
  const [analytics, setAnalytics] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState('7d')

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await analyticsService.getAnalytics(timeRange)
      setAnalytics(data)
    } catch (err) {
      setError(err.message)
      toast.error('Fehler beim Laden der Analytics-Daten')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const handleTimeRangeChange = (range) => {
    setTimeRange(range)
  }

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadAnalytics} />
  }

  const stats = [
    {
      title: 'Gesamt-Aufrufe',
      value: analytics.totalViews || '2.547',
      icon: 'Eye',
      trend: 'up',
      trendValue: '+24%',
      color: 'primary'
    },
    {
      title: 'Konversionen',
      value: analytics.conversions || '189',
      icon: 'Target',
      trend: 'up',
      trendValue: '+12%',
      color: 'accent'
    },
    {
      title: 'Konversionsrate',
      value: analytics.conversionRate || '7.4%',
      icon: 'TrendingUp',
      trend: 'up',
      trendValue: '+0.8%',
      color: 'success'
    },
    {
      title: 'Durchschn. Sitzungsdauer',
      value: analytics.avgSessionDuration || '2:34',
      icon: 'Clock',
      trend: 'down',
      trendValue: '-5%',
      color: 'warning'
    }
  ]

  const topInteractions = [
    { action: 'Termin vereinbaren', count: 145, percentage: 65, icon: 'Calendar' },
    { action: 'Rückruf anfordern', count: 89, percentage: 40, icon: 'Phone' },
    { action: 'Öffnungszeiten anzeigen', count: 234, percentage: 85, icon: 'Clock' },
    { action: 'Praxis-Informationen', count: 167, percentage: 55, icon: 'Info' },
    { action: 'Chat beendet', count: 45, percentage: 15, icon: 'X' }
  ]

  const deviceStats = [
    { device: 'Desktop', percentage: 45, count: 1147 },
    { device: 'Mobil', percentage: 42, count: 1070 },
    { device: 'Tablet', percentage: 13, count: 330 }
  ]

  const timeRanges = [
    { value: '24h', label: '24 Stunden' },
    { value: '7d', label: '7 Tage' },
    { value: '30d', label: '30 Tage' },
    { value: '90d', label: '90 Tage' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-surface-600">
            Verfolgen Sie die Leistung Ihres Widgets und das Nutzerverhalten
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTimeRangeChange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Widget Interactions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
            <ApperIcon name="BarChart3" size={24} className="mr-3 text-primary-600" />
            Top Widget-Interaktionen
          </h2>
          
          <div className="space-y-4">
            {topInteractions.map((interaction, index) => (
              <motion.div
                key={interaction.action}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name={interaction.icon} size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-900">{interaction.action}</p>
                    <p className="text-sm text-surface-600">{interaction.count} Interaktionen</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-24 bg-surface-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${interaction.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-surface-900 w-10 text-right">
                    {interaction.percentage}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Device Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
            <ApperIcon name="Smartphone" size={24} className="mr-3 text-primary-600" />
            Geräte-Verteilung
          </h2>
          
          <div className="space-y-6">
            {/* Device Stats */}
            <div className="space-y-4">
              {deviceStats.map((device, index) => (
                <motion.div
                  key={device.device}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-3 h-3 rounded-full
                      ${index === 0 ? 'bg-primary-500' : ''}
                      ${index === 1 ? 'bg-accent-500' : ''}
                      ${index === 2 ? 'bg-yellow-500' : ''}
                    `}></div>
                    <span className="font-medium text-surface-900">{device.device}</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-surface-900">{device.percentage}%</p>
                    <p className="text-sm text-surface-600">{device.count} Aufrufe</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Visual Chart Placeholder */}
            <div className="relative h-48 bg-surface-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-surface-600">
                <ApperIcon name="PieChart" size={48} className="mx-auto mb-2 text-surface-400" />
                <p className="text-sm">Interaktives Diagramm</p>
                <p className="text-xs">Geräte-Verteilung Visualisierung</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Response Times */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center">
            <ApperIcon name="Zap" size={20} className="mr-2 text-accent-600" />
            Widget-Performance
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-surface-600">Ladezeit</span>
              <span className="font-medium text-surface-900">1.2s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-surface-600">Erste Interaktion</span>
              <span className="font-medium text-surface-900">3.8s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-surface-600">Chatbot-Antwort</span>
              <span className="font-medium text-surface-900">0.5s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-surface-600">Formular-Übertragung</span>
              <span className="font-medium text-surface-900">2.1s</span>
            </div>
          </div>
        </Card>

        {/* Peak Hours */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center">
            <ApperIcon name="Clock" size={20} className="mr-2 text-primary-600" />
            Hauptnutzungszeiten
          </h3>
          
          <div className="space-y-3">
            {[
              { time: '09:00 - 10:00', activity: 'Hoch', percentage: 85 },
              { time: '14:00 - 15:00', activity: 'Sehr Hoch', percentage: 95 },
              { time: '16:00 - 17:00', activity: 'Hoch', percentage: 78 },
              { time: '11:00 - 12:00', activity: 'Mittel', percentage: 45 }
            ].map((hour, index) => (
              <div key={hour.time} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-900">{hour.time}</p>
                  <p className="text-xs text-surface-600">{hour.activity}</p>
                </div>
                <div className="w-16 bg-surface-200 rounded-full h-2">
                  <div 
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${hour.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Success Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center">
            <ApperIcon name="Target" size={20} className="mr-2 text-accent-600" />
            Erfolgsmessungen
          </h3>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-accent-50 rounded-lg">
              <p className="text-2xl font-bold text-accent-600">94%</p>
              <p className="text-sm text-accent-700">Erfolgreiche Formular-Übertragungen</p>
            </div>
            
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <p className="text-2xl font-bold text-primary-600">7.4%</p>
              <p className="text-sm text-primary-700">Konversionsrate</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">4.2/5</p>
              <p className="text-sm text-green-700">Durchschnittliche Bewertung</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center">
          <ApperIcon name="Activity" size={24} className="mr-3 text-primary-600" />
          Letzte Aktivitäten
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="text-left py-3 px-4 font-medium text-surface-700">Zeit</th>
                <th className="text-left py-3 px-4 font-medium text-surface-700">Aktion</th>
                <th className="text-left py-3 px-4 font-medium text-surface-700">Gerät</th>
                <th className="text-left py-3 px-4 font-medium text-surface-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: '14:25', action: 'Termin vereinbart', device: 'Desktop', status: 'Erfolgreich' },
                { time: '14:18', action: 'Rückruf angefordert', device: 'Mobil', status: 'Erfolgreich' },
                { time: '14:12', action: 'Chatbot-Gespräch', device: 'Tablet', status: 'Abgebrochen' },
                { time: '14:05', action: 'Öffnungszeiten angezeigt', device: 'Desktop', status: 'Erfolgreich' },
                { time: '13:58', action: 'Praxis-Informationen', device: 'Mobil', status: 'Erfolgreich' }
              ].map((activity, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-surface-100 hover:bg-surface-50"
                >
                  <td className="py-3 px-4 text-sm text-surface-600">{activity.time}</td>
                  <td className="py-3 px-4 text-sm font-medium text-surface-900">{activity.action}</td>
                  <td className="py-3 px-4 text-sm text-surface-600">{activity.device}</td>
                  <td className="py-3 px-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${activity.status === 'Erfolgreich' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }
                    `}>
                      {activity.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Analytics