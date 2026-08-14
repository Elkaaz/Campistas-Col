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
  },

  // Prevención y Salud
  'prevencion-salud': {
    nombre: 'Prevención y Salud',
    enlacePdf: 'https://drive.google.com/uc?export=download&id=1MRQ5PRoRy_q4rSWYW9KD3KWAkswvD_69',
    enlaceVer: 'https://drive.google.com/file/d/1MRQ5PRoRy_q4rSWYW9KD3KWAkswvD_69/view?usp=drive_link',
    icono: '🏥',
    colorTema: '#DC143C',
  },

  // Conciencia Ambiental
  'conciencia-ambiental': {
    nombre: 'Conciencia Ambiental',
    enlacePdf: 'https://drive.google.com/uc?export=download&id=1l73Bmu22m0Mna2Pbb43bfpkKqEDUgsQD',
    enlaceVer: 'https://drive.google.com/file/d/1l73Bmu22m0Mna2Pbb43bfpkKqEDUgsQD/view?usp=drive_link',
    icono: '🌍',
    colorTema: '#2E8B57',
  },

  // Formación y Crecimiento Personal
  'formacion-liderazgo': {
    nombre: 'Formación, Crecimiento Personal, Voluntariado y Liderazgo',
    enlacePdf: 'https://drive.google.com/uc?export=download&id=1iIt2nmoB3EgE2-N3LL2V-QP9upx9Cn71',
    enlaceVer: 'https://drive.google.com/file/d/1iIt2nmoB3EgE2-N3LL2V-QP9upx9Cn71/view?usp=drive_link',
    icono: '👥',
    colorTema: '#4169E1',
  },

  // Guía Técnica Programa Campamentos Juveniles
  'guia-tecnica': {
    nombre: 'Guía Técnica - Programa Campamentos Juveniles',
    enlacePdf: 'https://drive.google.com/uc?export=download&id=1yKYr2VzmIdEEXcNKE1tK-OHBMIBmYll3',
    enlaceVer: 'https://drive.google.com/file/d/1yKYr2VzmIdEEXcNKE1tK-OHBMIBmYll3/view?usp=drive_link',
    icono: '📖',
    colorTema: '#FF6347',
  },
}

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
