import { useState, useEffect } from 'react'

export default function ConnectionStatus() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (online) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#f59e0b',
      color: '#fff',
      textAlign: 'center',
      padding: '6px 12px',
      fontSize: 12,
      fontWeight: 700,
      zIndex: 9999,
    }}>
      Sin conexión — algunas funciones estarán limitadas
    </div>
  )
}
