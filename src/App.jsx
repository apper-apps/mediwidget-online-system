import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import WidgetSettings from '@/components/pages/WidgetSettings'
import PracticeInfo from '@/components/pages/PracticeInfo'
import OpeningHours from '@/components/pages/OpeningHours'
import CallbackSetup from '@/components/pages/CallbackSetup'
import ChatbotBuilder from '@/components/pages/ChatbotBuilder'
import Analytics from '@/components/pages/Analytics'
import EmbedInstall from '@/components/pages/EmbedInstall'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface-100">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="widget-settings" element={<WidgetSettings />} />
            <Route path="practice-info" element={<PracticeInfo />} />
            <Route path="opening-hours" element={<OpeningHours />} />
            <Route path="callback-setup" element={<CallbackSetup />} />
            <Route path="chatbot-builder" element={<ChatbotBuilder />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="embed-install" element={<EmbedInstall />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  )
}

export default App