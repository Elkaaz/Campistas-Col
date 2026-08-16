export function registerServiceWorker() {
  // Service worker desactivado temporalmente para resolver problema de cache
  // que dejaba la app en blanco en producción
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
  // navigator.serviceWorker.register('/sw.js').then((registration) => {
  //   console.log('[SW] Registrado:', registration.scope)
  // }).catch((error) => {
  //   console.warn('[SW] Fallo al registrar:', error)
  // })
}
