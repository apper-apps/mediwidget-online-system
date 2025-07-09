import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import WidgetPreview from "@/components/organisms/WidgetPreview";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import StatsCard from "@/components/molecules/StatsCard";
import { analyticsService } from "@/services/api/analyticsService";
import { practiceService } from "@/services/api/practiceService";
import { widgetService } from "@/services/api/widgetService";
import { authService } from "@/services/api/authService";
const Dashboard = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [practiceInfo, setPracticeInfo] = useState(null)
  const [widgetStats, setWidgetStats] = useState(null)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get current user first
      const user = await authService.getCurrentUser()
      setCurrentUser(user)
      
      if (!user) {
        throw new Error('Benutzer nicht gefunden')
      }
      
const [practice, stats, analytics] = await Promise.all([
        practiceService.getById(user.practiceId || 1),
        widgetService.getStats(),
        analyticsService.getAnalytics('7d', user.id)
      ])
      
      setPracticeInfo(practice)
      setWidgetStats(stats)
      setAnalyticsData(analytics)
      setData([practice, stats])
    } catch (err) {
      setError(err.message)
      toast.error('Fehler beim Laden der Dashboard-Daten: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

const stats = [
    {
      title: 'Widget-Aufrufe',
      value: analyticsData?.totalViews || widgetStats?.views || '2,547',
      icon: 'Eye',
      trend: 'up',
      trendValue: '+12%',
      color: 'primary'
    },
    {
      title: 'Termin-Anfragen',
      value: analyticsData?.conversions || widgetStats?.appointments || '189',
      icon: 'Calendar',
      trend: 'up',
      trendValue: '+8%',
      color: 'accent'
    },
    {
      title: 'Rückruf-Anfragen',
      value: widgetStats?.callbacks || '156',
      icon: 'Phone',
      trend: 'down',
      trendValue: '-3%',
      color: 'warning'
    },
    {
      title: 'Chat-Interaktionen',
      value: widgetStats?.chats || '432',
      icon: 'MessageSquare',
      trend: 'up',
      trendValue: '+15%',
      color: 'success'
    }
  ]

  const quickActions = [
    {
      title: 'Widget-Einstellungen',
      description: 'Design und Verhalten anpassen',
      icon: 'Settings',
      action: '/widget-settings',
      color: 'primary'
    },
    {
      title: 'Öffnungszeiten aktualisieren',
      description: 'Aktuelle Zeiten pflegen',
      icon: 'Clock',
      action: '/opening-hours',
      color: 'accent'
    },
    {
      title: 'Chatbot bearbeiten',
      description: 'Antworten personalisieren',
      icon: 'MessageSquare',
      action: '/chatbot-builder',
      color: 'success'
    },
    {
      title: 'Code einbetten',
      description: 'Widget auf Website installieren',
      icon: 'Code',
      action: '/embed-install',
      color: 'warning'
    }
  ]

  const recentActivity = [
    { action: 'Widget-Design aktualisiert', time: 'vor 2 Stunden', icon: 'Palette' },
    { action: 'Neue Termin-Anfrage erhalten', time: 'vor 4 Stunden', icon: 'Calendar' },
    { action: 'Öffnungszeiten geändert', time: 'vor 1 Tag', icon: 'Clock' },
    { action: 'Chatbot-Antwort hinzugefügt', time: 'vor 2 Tagen', icon: 'MessageSquare' },
    { action: 'Rückruf-Formular angepasst', time: 'vor 3 Tagen', icon: 'Phone' }
  ]

  return (
    <div className="space-y-8">
    {/* Welcome Section */}
    <motion.div
        initial={{
            opacity: 0,
            y: 20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h1 className="text-3xl font-bold mb-2">Willkommen zurück, {currentUser?.firstName} {currentUser?.lastName}!
                                </h1>
                <p className="text-primary-100 text-lg">Ihr Widget für {practiceInfo?.name || currentUser?.practiceName}ist aktiv und sammelt bereits Patientenanfragen.
                                </p>
            </div>
            <div className="mt-6 lg:mt-0">
                <Button
                    variant="secondary"
                    icon="Eye"
                    className="bg-white text-primary-600 hover:bg-primary-50"
                    onClick={() => {
                        const preview = document.querySelector(".widget-preview-section");

                        if (preview) {
                            preview.scrollIntoView({
                                behavior: "smooth"
                            });

                            toast.info("Widget-Vorschau wird angezeigt");
                        }
                    }}>Widget-Vorschau
                                </Button>
            </div>
        </div>
    </motion.div>
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => <motion.div
            key={stat.title}
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                delay: index * 0.1
            }}>
            <StatsCard {...stat} />
        </motion.div>)}
    </div>
    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
            <Card className="p-6">
                <h2 className="text-xl font-bold text-surface-900 mb-6">Schnellaktionen
                                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => <motion.div
                        key={action.title}
                        initial={{
                            opacity: 0,
                            scale: 0.95
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                        transition={{
                            delay: index * 0.1
                        }}>
                        <Card
                            clickable
                            onClick={() => window.location.href = action.action}
                            className="p-4 hover:shadow-lg transition-all duration-200">
                            <div className="flex items-start space-x-4">
                                <div
                                    className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        ${action.color === "primary" ? "bg-primary-100 text-primary-600" : ""}
                        ${action.color === "accent" ? "bg-accent-100 text-accent-600" : ""}
                        ${action.color === "success" ? "bg-green-100 text-green-600" : ""}
                        ${action.color === "warning" ? "bg-yellow-100 text-yellow-600" : ""}
                      `}>
                                    <ApperIcon name={action.icon} size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-surface-900 mb-1">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-surface-600">
                                        {action.description}
                                    </p>
                                </div>
                                <ApperIcon name="ChevronRight" size={16} className="text-surface-400" />
                            </div>
                        </Card>
                    </motion.div>)}
                </div>
            </Card>
        </div>
        {/* Widget Preview */}
        <div className="widget-preview-section">
            <Card className="p-6">
                <h2 className="text-lg font-bold text-surface-900 mb-4">Live Widget-Vorschau
                                </h2>
                <div className="flex justify-center">
                    <WidgetPreview practiceInfo={practiceInfo} size="mobile" />
                </div>
                <div className="mt-4 pt-4 border-t border-surface-200">
                    <Button
                        variant="outline"
                        size="sm"
                        icon="ExternalLink"
                        className="w-full"
                        onClick={() => {
                            const newWindow = window.open("", "_blank", "width=450,height=650,resizable=yes,scrollbars=yes");

                            if (newWindow) {
                                newWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>Widget Vollständige Vorschau</title>
                        <style>
                          body { margin: 0; padding: 20px; font-family: Inter, sans-serif; background: #f8fafc; }
                          .preview-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                        </style>
                      </head>
                      <body>
                        <div class="preview-container">
                          <div id="widget-preview-root"></div>
                        </div>
                        <script>
                          const practiceInfo = ${JSON.stringify(practiceInfo)};
                          // Full widget implementation would be loaded here
                          document.getElementById('widget-preview-root').innerHTML = 
                            '<div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 400px;"><h3>Widget Vollständige Vorschau</h3><p>Praxis: ' + (practiceInfo?.name || 'Dr. Muster Praxis') + '</p><p>Diese Vorschau zeigt das Widget in voller Größe.</p></div>';
                        </script>
                      </body>
                      </html>
                    `);

                                newWindow.document.close();
                                toast.success("Widget-Vorschau in neuem Fenster geöffnet");
                            } else {
                                toast.error("Popup wurde blockiert. Bitte erlauben Sie Popups für diese Seite.");
                            }
                        }}>Vollständige Vorschau
                                      </Button>
                </div>
            </Card>
        </div>
        {/* Recent Activity & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-surface-900">Letzte Aktivitäten
                                    </h2>
                    <Button variant="ghost" size="sm" icon="MoreHorizontal" />
                </div>
                <div className="space-y-4">
                    {recentActivity.map((activity, index) => <motion.div
                        key={index}
                        initial={{
                            opacity: 0,
                            x: -20
                        }}
                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                        transition={{
                            delay: index * 0.1
                        }}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-surface-50 transition-colors">
                        <div
                            className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <ApperIcon name={activity.icon} size={16} className="text-primary-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-surface-900">
                                {activity.action}
                            </p>
                            <p className="text-xs text-surface-600">
                                {activity.time}
                            </p>
                        </div>
                    </motion.div>)}
                </div>
            </Card>
            {/* Quick Stats */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-surface-900 mb-6">Heute im Überblick
                              </h2>
                <div className="space-y-4">
                    <div
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                <ApperIcon name="TrendingUp" size={16} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-900">Widget-Aufrufe</p>
                                <p className="text-xs text-surface-600">Heute</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary-600">
                                {Math.ceil(parseInt(
                                    (analyticsData?.totalViews || widgetStats?.views || "2547").replace(/,/g, "")
                                ) * 0.15) || "85"}
                            </p>
                            <p className="text-xs text-surface-600">+23% vs. gestern</p>
                        </div>
                    </div>
                    <div
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                                <ApperIcon name="Calendar" size={16} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-900">Neue Termine</p>
                                <p className="text-xs text-surface-600">Heute</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-accent-600">
                                {Math.ceil(parseInt(
                                    (analyticsData?.conversions || widgetStats?.appointments || "189").replace(/,/g, "")
                                ) * 0.08) || "15"}
                            </p>
                            <p className="text-xs text-surface-600">+5% vs. gestern</p>
                        </div>
                    </div>
                    <div
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                <ApperIcon name="Phone" size={16} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-900">Rückrufe</p>
                                <p className="text-xs text-surface-600">Heute</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-yellow-600">
                                {Math.ceil(parseInt((widgetStats?.callbacks || "156").replace(/,/g, "")) * 0.05) || "8"}
                            </p>
                            <p className="text-xs text-surface-600">-12% vs. gestern</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </div></div>
  )
}

export default Dashboard