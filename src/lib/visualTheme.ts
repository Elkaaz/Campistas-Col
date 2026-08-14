/**
 * Tema visual avanzado - Gradientes, sombras, efectos
 * Basado en el design system de Django
 */

// ===== GRADIENTES POR NIVEL =====
export const LEVEL_GRADIENTS = {
  semilla: 'linear-gradient(135deg, #8B7355 0%, #A0826D 100%)',
  raiz: 'linear-gradient(135deg, #654321 0%, #8B5A3C 100%)',
  tallo: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
  hoja: 'linear-gradient(135deg, #32CD32 0%, #90EE90 100%)',
  flor: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)',
  fruto: 'linear-gradient(135deg, #FF4500 0%, #FF6347 100%)',
} as const

// ===== SOMBRAS CONSISTENTES =====
export const SHADOWS = {
  sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
  md: '0 4px 12px rgba(0, 0, 0, 0.15)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.2)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
} as const

// ===== GRADIENTES POR TIPO DE RETO =====
export const RETO_GRADIENTS = {
  fogata: 'linear-gradient(135deg, #FF4500 0%, #FF6347 100%)',
  nudo: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
  refugio: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
  huerta: 'linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)',
  primeros_auxilios: 'linear-gradient(135deg, #DC143C 0%, #FF1493 100%)',
} as const

// ===== EFECTOS HOVER =====
export const HOVER_EFFECTS = {
  lift: 'transform 0.3s ease, box-shadow 0.3s ease',
  scale: 'transform 0.3s ease',
  color: 'background-color 0.3s ease, color 0.3s ease',
  all: 'all 0.3s ease',
} as const

// ===== FUNCIONES AUXILIARES =====

/**
 * Obtener gradiente por nivel
 */
export function getGradientByLevel(nivel: string): string {
  return LEVEL_GRADIENTS[nivel as keyof typeof LEVEL_GRADIENTS] || LEVEL_GRADIENTS.semilla
}

/**
 * Obtener gradiente por tipo de reto
 */
export function getGradientByReto(retoTipo: string): string {
  return RETO_GRADIENTS[retoTipo as keyof typeof RETO_GRADIENTS] || RETO_GRADIENTS.fogata
}

/**
 * Obtener sombra
 */
export function getShadow(size: 'sm' | 'md' | 'lg' | 'xl' | 'inner'): string {
  return SHADOWS[size]
}

/**
 * Aplicar efecto hover a elemento
 */
export const applyHoverLift = (element: HTMLElement) => {
  element.style.transition = HOVER_EFFECTS.lift
  element.addEventListener('mouseenter', () => {
    element.style.transform = 'translateY(-4px)'
    element.style.boxShadow = SHADOWS.lg
  })
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'translateY(0)'
    element.style.boxShadow = SHADOWS.md
  })
}

/**
 * CSS inline helpers
 */
export const STYLE = {
  cardContainer: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: SHADOWS.md,
    overflow: 'hidden' as const,
    transition: HOVER_EFFECTS.all,
  },

  cardHover: {
    boxShadow: SHADOWS.lg,
    transform: 'translateY(-2px)',
  },

  levelBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    fontWeight: 600,
    backdropFilter: 'blur(10px)',
    transition: HOVER_EFFECTS.all,
    boxShadow: SHADOWS.md,
  },

  levelBadgeHover: {
    background: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    transform: 'translateY(-2px)',
    boxShadow: SHADOWS.lg,
  },

  heroSection: {
    position: 'relative' as const,
    padding: '3rem 1.5rem',
    borderRadius: '12px',
    overflow: 'hidden' as const,
    color: 'white',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },

  leaderboardItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
    borderRadius: '8px',
    marginBottom: '0.75rem',
    transition: HOVER_EFFECTS.lift,
  },

  emptyState: {
    textAlign: 'center' as const,
    padding: '3rem 2rem',
    color: '#9E9E9E',
  },

  progressBar: {
    height: '8px',
    background: '#E0E0E0',
    borderRadius: '4px',
    overflow: 'hidden' as const,
    boxShadow: SHADOWS.inner,
  },

  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
    transition: 'width 0.5s ease',
    borderRadius: '4px',
    boxShadow: SHADOWS.sm,
  },
} as const

/**
 * Animaciones CSS como strings
 */
export const ANIMATIONS = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`
