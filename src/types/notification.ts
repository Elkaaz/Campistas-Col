export type NotificationTipo = 
  | 'fogata_recibida'
  | 'nudo_recibido'
  | 'comentario'
  | 'seguidor'
  | 'reto_validado'
  | 'reto_publicado'
  | 'nivel_subido'
  | 'comunicado'
  | 'evento_proximo'

export interface Notification {
  notificationId: string
  uid: string // destinatario
  tipo: NotificationTipo
  titulo: string
  mensaje: string
  referenciaId?: string // postId, userId, eventoId, etc.
  leido: boolean
  createdAt: Date
}

export interface CreateNotificationInput {
  uid: string
  tipo: NotificationTipo
  titulo: string
  mensaje: string
  referenciaId?: string
}
