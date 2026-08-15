import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'
import { notificationsService } from '../../services/notificationsService'
import '../../styles/pages.css'
import '../../styles/notification.css'

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

export default function NotificationsPage() {
  const { user } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead, loadNotifications } = useNotifications()

  useEffect(() => {
    if (user?.uid) {
      loadNotifications(user.uid)
    }
  }, [user?.uid, loadNotifications])

  const handleMarkAllRead = async () => {
    if (user?.uid) {
      await markAllAsRead(user.uid)
    }
  }

  if (!user) {
    return (
      <div className="page-shell" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p>Inicia sesión para ver tus notificaciones</p>
        <Link to="/auth" className="btn-primary">Iniciar sesión</Link>
      </div>
    )
  }

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1>🔔 Notificaciones</h1>
            <p className="page-subtitle">
              {unreadCount > 0
                ? `Tienes ${unreadCount} ${unreadCount === 1 ? 'notificación sin leer' : 'notificaciones sin leer'}`
                : 'No tienes notificaciones sin leer'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="btn-primary">
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔔</p>
            <h3>No tienes notificaciones</h3>
            <p>Cuando alguien interactúe contigo, aparecerá aquí</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.notificationId}
              className={`notification-card ${!notification.leido ? 'unread' : ''}`}
              onClick={() => !notification.leido && markAsRead(notification.notificationId)}
            >
              <span className="notification-card-icon">
                {NOTIFICATION_ICONS[notification.tipo] || '🔔'}
              </span>
              <div className="notification-card-content">
                <h4>{notification.titulo}</h4>
                <p>{notification.mensaje}</p>
                <small>
                  {new Date(notification.createdAt).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
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
    </div>
  )
}
