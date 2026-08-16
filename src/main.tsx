import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'
import { registerServiceWorker } from './lib/sw'
import ErrorBoundary from './components/common/ErrorBoundary'

registerServiceWorker()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      if (registration.scope.includes('campistas-col')) {
        registration.unregister().then(() => {
          console.log('[SW] Unregistered old service worker')
        }).catch((err) => {
          console.warn('[SW] Failed to unregister:', err)
        })
      }
    })
  })
}

window.addEventListener('error', (event) => {
  console.error('[GlobalError]', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('[UnhandledRejection]', event.reason)
})

try {
  const rootEl = document.getElementById('root')
  ReactDOM.createRoot(rootEl!).render(
    <React.StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </React.StrictMode>,
  )
} catch (e) {
  console.error('[MountError]', e)
  document.body.innerHTML = '<pre style="padding:40px;color:red;background:#000;font-size:16px;">' + (e instanceof Error ? e.message : String(e)) + '</pre>'
}
