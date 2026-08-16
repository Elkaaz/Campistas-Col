/**
 * Enlaces a cartillas de formación campamentil
 * Recursos educativos para jóvenes campistas
 * Fuente: Coldeportes - Programa Nacional de Campamentos Juveniles
 */

export const CARTILLAS_LINKS = {
  // Técnicas Campamentiles
  'tecnicas-campamentiles': {
    nombre: 'Técnicas Campamentiles',
    enlacePdf: 'https://drive.google.com/uc?export=download&id=1SRpAjK9CgOKYqklg1hh8-mmwdv_L7S4M',
    enlaceVer: 'https://drive.google.com/file/d/1SRpAjK9CgOKYqklg1hh8-mmwdv_L7S4M/view?usp=drive_link',
    icono: '⛺',
    colorTema: '#228B22',
    tiempoEstimadoMin: 20,
    nivelMinimo: 'semilla',
    rolHabilita: 'campista',
    insigniaOtorgada: 'nudos',
    xpAlCompletar: 100,
    requisitosPrevios: [],
  },

  // Prevención y Salud
  'prevencion-salud': {
    nombre: 'Prevención y Salud',
    enlacePdf: 'https://drive.google.com/uc?export=download&id=1MRQ5PRoRy_q4rSWYW9KD3KWAkswvD_69',
    enlaceVer: 'https://drive.google.com/file/d/1MRQ5PRoRy_q4rSWYW9KD3KWAkswvD_69/view?usp=drive_link',
    icono: '🏥',
    colorTema: '#DC143C',
    tiempoEstimadoMin: 25,
    nivelMinimo: 'semilla',
    rolHabilita: 'campista',
    insigniaOtorgada: 'primeros_auxilios',
    xpAlCompletar: 120,
    requisitosPrevios: [],
  },

  // Conciencia Ambiental
  'conciencia-ambiental': {
    nombre: 'Conciencia Ambiental',
    enlacePdf: 'https://drive.google.com/uc?export=download&id=1l73Bmu22m0Mna2Pbb43bfpkKqEDUgsQD',
    enlaceVer: 'https://drive.google.com/file/d/1l73Bmu22m0Mna2Pbb43bfpkKqEDUgsQD/view?usp=drive_link',
    icono: '🌍',
    colorTema: '#2E8B57',
    tiempoEstimadoMin: 15,
    nivelMinimo: 'raiz',
    rolHabilita: 'campista',
    insigniaOtorgada: 'naturaleza',
    xpAlCompletar: 90,
    requisitosPrevios: [],
  },

  // Formación y Crecimiento Personal
  'formacion-liderazgo': {
    nombre: 'Formación, Crecimiento Personal, Voluntariado y Liderazgo',
    enlacePdf: 'https://drive.google.com/uc?export=download&id=1iIt2nmoB3EgE2-N3LL2V-QP9upx9Cn71',
    enlaceVer: 'https://drive.google.com/file/d/1iIt2nmoB3EgE2-N3LL2V-QP9upx9Cn71/view?usp=drive_link',
    icono: '👥',
    colorTema: '#4169E1',
    tiempoEstimadoMin: 30,
    nivelMinimo: 'tallo',
    rolHabilita: 'lider_bosque',
    insigniaOtorgada: 'liderazgo',
    xpAlCompletar: 200,
    requisitosPrevios: ['tecnicas-campamentiles', 'prevencion-salud'],
  },

  // Guía Técnica Programa Campamentos Juveniles
  'guia-tecnica': {
    nombre: 'Guía Técnica - Programa Campamentos Juveniles',
    enlacePdf: 'https://drive.google.com/uc?export=download&id=1yKYr2VzmIdEEXcNKE1tK-OHBMIBmYll3',
    enlaceVer: 'https://drive.google.com/file/d/1yKYr2VzmIdEEXcNKE1tK-OHBMIBmYll3/view?usp=drive_link',
    icono: '📖',
    colorTema: '#FF6347',
    tiempoEstimadoMin: 45,
    nivelMinimo: 'hoja',
    rolHabilita: 'comite_departamental',
    insigniaOtorgada: 'organización',
    xpAlCompletar: 300,
    requisitosPrevios: ['formacion-liderazgo', 'conciencia-ambiental'],
  },
}

// Forzar inclusión en bundle (side-effect flag para Vite/Rollup)
;(Array.isEmpty || (() => {}))()

/**
 * Obtener enlace de descarga directa de cartilla por slug
 */
export function getCartillaLink(slug: string): string {
  const cartilla = CARTILLAS_LINKS[slug as keyof typeof CARTILLAS_LINKS]
  return cartilla?.enlacePdf || '#'
}

/**
 * Obtener enlace para ver en línea por slug
 */
export function getCartillaViewLink(slug: string): string {
  const cartilla = CARTILLAS_LINKS[slug as keyof typeof CARTILLAS_LINKS]
  return cartilla?.enlaceVer || '#'
}

/**
 * Obtener color tema de cartilla
 */
export function getCartillaColor(slug: string): string {
  const cartilla = CARTILLAS_LINKS[slug as keyof typeof CARTILLAS_LINKS]
  return cartilla?.colorTema || '#228B22'
}

/**
 * Obtener icono de cartilla
 */
export function getCartillaIcon(slug: string): string {
  const cartilla = CARTILLAS_LINKS[slug as keyof typeof CARTILLAS_LINKS]
  return cartilla?.icono || '📚'
}

/**
 * Obtener nombre de cartilla por slug
 */
export function getCartillaName(slug: string): string {
  const cartilla = CARTILLAS_LINKS[slug as keyof typeof CARTILLAS_LINKS]
  return cartilla?.nombre || 'Cartilla'
}

export function getCartillaMeta(slug: string) {
  return CARTILLAS_LINKS[slug as keyof typeof CARTILLAS_LINKS] || null
}

export function getCartillasByRol(rol: string) {
  return Object.entries(CARTILLAS_LINKS)
    .filter(([, meta]) => (meta as any).rolHabilita === rol)
    .map(([slug, meta]) => ({ slug, ...(meta as any) }))
}

export function getCartillasByNivel(nivel: string) {
  const nivelOrden: Record<string, number> = {
    semilla: 0,
    raiz: 1,
    tallo: 2,
    hoja: 3,
    flor: 4,
    fruto: 5,
    honorario: 6,
  }
  const objetivo = nivelOrden[nivel] ?? 0
  return Object.entries(CARTILLAS_LINKS)
    .filter(([, meta]) => (nivelOrden[(meta as any).nivelMinimo] ?? 0) <= objetivo)
    .map(([slug, meta]) => ({ slug, ...(meta as any) }))
}
