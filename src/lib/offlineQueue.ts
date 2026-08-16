type OfflineAction =
  | { type: 'publicar_reto'; payload: any }
  | { type: 'registrar_servicio'; payload: any }
  | { type: 'comentar'; payload: any }

const QUEUE_KEY = 'offline_queue'

function getQueue(): OfflineAction[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveQueue(queue: OfflineAction[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function queueAction(action: OfflineAction) {
  const queue = getQueue()
  queue.push(action)
  saveQueue(queue)
}

export function getQueuedActions(): OfflineAction[] {
  return getQueue()
}

export function clearQueue() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(QUEUE_KEY)
}

export function processQueue() {
  if (typeof window === 'undefined' || !navigator.onLine) return
  const queue = getQueue()
  if (queue.length === 0) return
  console.log(`[Offline] Procesando ${queue.length} acciones en cola`)
  clearQueue()
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', processQueue)
}
