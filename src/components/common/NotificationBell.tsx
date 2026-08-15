import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'
import { notificationsService } from '../../services/notificationsService'
import '../../styles/components.css'

const NOTIFICATION_ICONS: Record<string, string> = {
  fogata_recibida: '🔥',
  nudo_recibido: '🪢',
  comentario: '💬',
  seguidor: '👤',
  reto_validado: '✅',
  reto_publicado: '⛰️',
  nivel_subido: '🎉',
  comunicado: '📢',
  evento_proximo: '📅',
}

export default function NotificationBell() {
  const { user } = useAuth()
  const { notifications, unreadCount, loading, loadNotifications, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user?.uid) {
      loadNotifications(user.uid)
    }
  }, [user?.uid, loadNotifications])

  const handleNotificationClick = async (notificationId: string) => {
    await markAsRead(notificationId)
    setIsOpen(false)
  }

  const handleMarkAllRead = async () => {
    if (user?.uid) {
      await markAllAsRead(user.uid)
    }
  }

  if (!user) return null

  return (
    <div className="notification-wrapper">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        title="Notificaciones"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="notification-overlay" onClick={() => setIsOpen(false)} />
          <div className="notification-dropdown">
            <div className="notification-header">
              <h4>Notificaciones</h4>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="notification-mark-all">
                  Marcar todas como leídas
                </button>
              )}
            </div>

            <div className="notification-list">
              {loading ? (
                <div className="notification-loading">Cargando...</div>
              ) : notifications.length === 0 ? (
                <div className="notification-empty">
                  <p>No tienes notificaciones</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.notificationId}
                    className={`notification-item ${!notification.leido ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification.notificationId)}
                  >
                    <span className="notification-icon">
                      {NOTIFICATION_ICONS[notification.tipo] || '🔔'}
                    </span>
                    <div className="notification-content">
                      <strong>{notification.titulo}</strong>
                      <p>{notification.mensaje}</p>
                      <small>
                        {new Date(notification.createdAt).toLocaleDateString('es-CO', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </small>
                    </div>
                    {!notification.leido && <span className="notification-dot" />}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 10 && (
              <Link to="/notificaciones" className="notification-view-all" onClick={() => setIsOpen(false)}>
                Ver todas las notificaciones
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  )
}
