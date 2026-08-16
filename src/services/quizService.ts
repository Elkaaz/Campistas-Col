import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  orderBy,
  Timestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { badgeService } from './badgeService'
import type { QuizQuestion } from '../types'

export type QuizResult = {
  resultId: string
  uid: string
  quizId: string
  cartillaId: string
  score: number          // 0-100
  correctas: number
  totalPreguntas: number
  xpGanado: number
  badgeOtorgado?: string
  tiempoSegundos: number
  completadoAt: Date
}

// Preguntas por cartilla
const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  'tecnicas-campamentiles': [
    {
      id: 'tc-1',
      cartillaId: 'tecnicas-campamentiles',
      pregunta: '¿Cuál es el nudo más básico y versátil en campamento?',
      opciones: ['Nudo ballestrinque', 'Nudo plano', 'Nudo as de guía', 'Nudo prusik'],
      respuestaCorrecta: 2,
      explicacion: 'El nudo as de guía (o "bowline") es el más versátil: no se cierra bajo carga y es fácil de deshacer.',
      puntos: 25,
      dificultad: 'facil',
    },
    {
      id: 'tc-2',
      cartillaId: 'tecnicas-campamentiles',
      pregunta: '¿Qué forma debe tener el campamento para maximizar la ventilación y evitar acumulación de agua?',
      opciones: ['Circular', 'En L', 'Triangular elevado', 'En línea recta'],
      respuestaCorrecta: 2,
      explicacion: 'Ubicar el campamento en terreno elevado con forma triangular favorece el drenaje y la ventilación.',
      puntos: 25,
      dificultad: 'medio',
    },
    {
      id: 'tc-3',
      cartillaId: 'tecnicas-campamentiles',
      pregunta: '¿A qué distancia mínima de un río o lago se debe acampar?',
      opciones: ['5 metros', '15 metros', '30 metros', '50 metros'],
      respuestaCorrecta: 2,
      explicacion: 'Se recomienda acampar mínimo 30 metros de fuentes de agua para evitar inundaciones y proteger el ecosistema.',
      puntos: 25,
      dificultad: 'medio',
    },
    {
      id: 'tc-4',
      cartillaId: 'tecnicas-campamentiles',
      pregunta: '¿Qué material natural es mejor para cubrir el suelo de un refugio de emergencia?',
      opciones: ['Hojas húmedas', 'Ramas con hojas secas', 'Tierra suelta', 'Piedras planas'],
      respuestaCorrecta: 1,
      explicacion: 'Las ramas con hojas secas proveen aislamiento térmico y son fáciles de conseguir en el bosque.',
      puntos: 25,
      dificultad: 'facil',
    },
  ],
  'prevencion-salud': [
    {
      id: 'ps-1',
      cartillaId: 'prevencion-salud',
      pregunta: '¿Cuántas compresiones por minuto se hacen en la RCP básica?',
      opciones: ['60-80', '80-100', '100-120', '120-140'],
      respuestaCorrecta: 2,
      explicacion: 'La RCP de calidad requiere 100-120 compresiones por minuto con una profundidad de 5-6 cm.',
      puntos: 25,
      dificultad: 'medio',
    },
    {
      id: 'ps-2',
      cartillaId: 'prevencion-salud',
      pregunta: '¿Qué hacer primero ante una hemorragia externa grave?',
      opciones: ['Aplicar torniquete', 'Limpiar la herida', 'Aplicar presión directa con tela limpia', 'Elevar la extremidad'],
      respuestaCorrecta: 2,
      explicacion: 'La presión directa sobre la herida es el primer paso para controlar una hemorragia. El torniquete solo en casos extremos.',
      puntos: 25,
      dificultad: 'facil',
    },
    {
      id: 'ps-3',
      cartillaId: 'prevencion-salud',
      pregunta: '¿Cuál es el signo principal de una insolación grave?',
      opciones: ['Escalofríos', 'Piel seca y caliente sin sudoración', 'Náuseas leves', 'Dolor de cabeza'],
      respuestaCorrecta: 1,
      explicacion: 'Piel seca y caliente (sin sudoración) indica que el cuerpo perdió su capacidad de enfriarse — emergencia médica.',
      puntos: 25,
      dificultad: 'dificil',
    },
    {
      id: 'ps-4',
      cartillaId: 'prevencion-salud',
      pregunta: '¿Cuánto tiempo mínimo debe hervirse el agua en alturas mayores a 2000 msnm para potabilizarla?',
      opciones: ['1 minuto', '3 minutos', '5 minutos', '10 minutos'],
      respuestaCorrecta: 1,
      explicacion: 'En alturas mayores a 2000 msnm el punto de ebullición baja, por eso se debe hervir al menos 3 minutos.',
      puntos: 25,
      dificultad: 'medio',
    },
  ],
  'conciencia-ambiental': [
    {
      id: 'ca-1',
      cartillaId: 'conciencia-ambiental',
      pregunta: '¿Cuánto tiempo tarda en descomponerse una bolsa plástica en la naturaleza?',
      opciones: ['1-5 años', '10-20 años', '100-400 años', '500-1000 años'],
      respuestaCorrecta: 2,
      explicacion: 'Las bolsas plásticas pueden tardar entre 100 y 400 años en descomponerse, contaminando suelos y aguas.',
      puntos: 25,
      dificultad: 'facil',
    },
    {
      id: 'ca-2',
      cartillaId: 'conciencia-ambiental',
      pregunta: '¿Qué principio resume el campismo responsable con el entorno?',
      opciones: ['Deja tu huella', 'No dejes rastro (Leave No Trace)', 'Mínimo impacto máximo disfrute', 'Solo lo necesario'],
      respuestaCorrecta: 1,
      explicacion: 'El principio "Leave No Trace" (No dejes rastro) es el estándar internacional para el campismo responsable.',
      puntos: 25,
      dificultad: 'facil',
    },
    {
      id: 'ca-3',
      cartillaId: 'conciencia-ambiental',
      pregunta: '¿Cómo se debe disponer de los residuos orgánicos en el campo?',
      opciones: ['Enterrar en hoyo profundo lejos de fuentes de agua', 'Quemar junto a la fogata', 'Dejar en el suelo para que se descomponga', 'Llevar en bolsa de vuelta a la ciudad'],
      respuestaCorrecta: 0,
      explicacion: 'Los residuos orgánicos deben enterrarse a al menos 15-20 cm de profundidad, a 60 m de agua, senderos y campamentos.',
      puntos: 25,
      dificultad: 'medio',
    },
    {
      id: 'ca-4',
      cartillaId: 'conciencia-ambiental',
      pregunta: '¿Cuál es el jabón correcto para usar cerca de fuentes naturales de agua?',
      opciones: ['Jabón antibacterial', 'Detergente líquido', 'Jabón biodegradable', 'Cualquier jabón sirve'],
      respuestaCorrecta: 2,
      explicacion: 'Solo el jabón biodegradable es aceptable cerca de fuentes de agua — y aun así debe usarse lejos del cauce.',
      puntos: 25,
      dificultad: 'facil',
    },
  ],
  'formacion-liderazgo': [
    {
      id: 'fl-1',
      cartillaId: 'formacion-liderazgo',
      pregunta: '¿Cuál es la característica más importante de un líder campista?',
      opciones: ['Ser el más fuerte físicamente', 'Escuchar y motivar a su equipo', 'Tomar todas las decisiones solo', 'Conocer todos los nudos'],
      respuestaCorrecta: 1,
      explicacion: 'Un buen líder escucha a su equipo, los motiva y toma decisiones considerando a todos los miembros.',
      puntos: 25,
      dificultad: 'facil',
    },
    {
      id: 'fl-2',
      cartillaId: 'formacion-liderazgo',
      pregunta: '¿Qué es la resolución asertiva de conflictos?',
      opciones: ['Imponer la solución del líder', 'Ignorar el conflicto', 'Expresar necesidades sin agredir ni someterse', 'Votar siempre en grupo'],
      respuestaCorrecta: 2,
      explicacion: 'La asertividad permite expresar lo que necesitamos de forma clara y respetuosa, sin agredir ni ceder inapropiadamente.',
      puntos: 30,
      dificultad: 'medio',
    },
    {
      id: 'fl-3',
      cartillaId: 'formacion-liderazgo',
      pregunta: '¿Qué técnica de comunicación ayuda más a entender a otro?',
      opciones: ['Dar consejos inmediatos', 'Escucha activa con preguntas abiertas', 'Interrumpir para aclarar', 'Hablar más que el otro'],
      respuestaCorrecta: 1,
      explicacion: 'La escucha activa — con atención plena y preguntas abiertas — es la base de la comunicación efectiva.',
      puntos: 25,
      dificultad: 'medio',
    },
    {
      id: 'fl-4',
      cartillaId: 'formacion-liderazgo',
      pregunta: '¿Cómo se llama el estilo de liderazgo que adapta su enfoque según la madurez del grupo?',
      opciones: ['Liderazgo situacional', 'Liderazgo transformacional', 'Liderazgo autocrático', 'Liderazgo laissez-faire'],
      respuestaCorrecta: 0,
      explicacion: 'El liderazgo situacional adapta el estilo (directivo, persuasivo, participativo, delegativo) según el nivel de madurez del equipo.',
      puntos: 20,
      dificultad: 'dificil',
    },
  ],
  'guia-tecnica': [
    {
      id: 'gt-1',
      cartillaId: 'guia-tecnica',
      pregunta: '¿Cuál es la edad mínima para participar en los Campamentos Juveniles de Colombia?',
      opciones: ['8 años', '10 años', '12 años', '14 años'],
      respuestaCorrecta: 1,
      explicacion: 'El programa de Campamentos Juveniles de Colombia está diseñado para jóvenes a partir de los 10 años.',
      puntos: 20,
      dificultad: 'facil',
    },
    {
      id: 'gt-2',
      cartillaId: 'guia-tecnica',
      pregunta: '¿Quién emite la certificación oficial del programa de Campamentos Juveniles?',
      opciones: ['Ministerio de Educación', 'Coldeportes (MinDeporte)', 'Alcaldía municipal', 'Cruz Roja'],
      respuestaCorrecta: 1,
      explicacion: 'El Ministerio del Deporte (antes Coldeportes) es la entidad que regula y certifica el programa nacional.',
      puntos: 25,
      dificultad: 'medio',
    },
    {
      id: 'gt-3',
      cartillaId: 'guia-tecnica',
      pregunta: '¿Cuántos campistas debe tener mínimo un bosque local para ser reconocido oficialmente?',
      opciones: ['5', '8', '10', '15'],
      respuestaCorrecta: 2,
      explicacion: 'Se requieren al menos 10 campistas para conformar y reconocer oficialmente un bosque local.',
      puntos: 25,
      dificultad: 'medio',
    },
    {
      id: 'gt-4',
      cartillaId: 'guia-tecnica',
      pregunta: '¿Qué documentos se requieren para registrar un campamento oficial?',
      opciones: [
        'Solo lista de asistentes',
        'Plan de actividades y autorización de padres',
        'Plan de actividades, autorización de padres, seguro médico y líder certificado',
        'Solo el líder certificado',
      ],
      respuestaCorrecta: 2,
      explicacion: 'Un campamento oficial requiere plan de actividades, autorizaciones de padres, cobertura médica y un líder con certificación vigente.',
      puntos: 30,
      dificultad: 'dificil',
    },
  ],
}

export const quizService = {
  /**
   * Obtener preguntas para una cartilla
   */
  getQuestionsByCartilla(cartillaId: string): QuizQuestion[] {
    return QUIZ_QUESTIONS[cartillaId] || []
  },

  /**
   * Guardar resultado de quiz en Firestore
   */
  async saveQuizResult(
    uid: string,
    cartillaId: string,
    score: number,
    correctas: number,
    totalPreguntas: number,
    xpGanado: number,
    tiempoSegundos: number,
    badgeOtorgado?: string
  ): Promise<string> {
    if (!db) throw new Error('Firestore not initialized')
    try {
      const quizId = `quiz-${cartillaId}`
      const docRef = await addDoc(collection(db, 'quizResultados'), {
        uid,
        quizId,
        cartillaId,
        score,
        correctas,
        totalPreguntas,
        xpGanado,
        tiempoSegundos,
        badgeOtorgado: badgeOtorgado || null,
        completadoAt: Timestamp.now(),
      })

      // Update cartilla progress
      await setDoc(
        doc(db, 'cartillasProgreso', `${uid}_${cartillaId}`),
        {
          uid,
          cartillaId,
          completada: score >= 70,
          porcentajeLeido: 100,
          quizResultado: score,
          xpGanado,
          badgeOtorgado: badgeOtorgado || null,
          fechaCompletado: score >= 70 ? Timestamp.now() : null,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      )

      // If badge earned, store it in userBadges via badgeService
      if (badgeOtorgado && score >= 70) {
        await badgeService.grantBadge(uid, badgeOtorgado, 'quiz')
        // Check completista badge
        await badgeService.checkCompletistaBadge(uid)
        // Check level badge with estimated XP
        await badgeService.checkLevelBadge(uid, xpGanado)
      }

      return docRef.id
    } catch (error) {
      console.error('Error saving quiz result:', error)
      throw error
    }
  },

  /**
   * Obtener resultados de quizzes de un usuario
   */
  async getUserQuizResults(uid: string): Promise<QuizResult[]> {
    if (!db) return []
    try {
      const q = query(
        collection(db, 'quizResultados'),
        where('uid', '==', uid),
        orderBy('completadoAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({
        ...d.data(),
        resultId: d.id,
        completadoAt: d.data().completadoAt?.toDate() || new Date(),
      } as QuizResult))
    } catch (error) {
      console.error('Error getting quiz results:', error)
      return []
    }
  },

  /**
   * Verificar si un usuario ya completó el quiz de una cartilla
   */
  async getUserCartillaProgress(uid: string, cartillaId: string) {
    if (!db) return null
    try {
      const docRef = doc(db, 'cartillasProgreso', `${uid}_${cartillaId}`)
      const snap = await getDoc(docRef)
      return snap.exists() ? snap.data() : null
    } catch (error) {
      console.error('Error getting cartilla progress:', error)
      return null
    }
  },

  /**
   * Calcular XP ganado según score y base de la cartilla
   */
  calcularXP(score: number, xpBase: number): number {
    if (score >= 90) return xpBase               // 100%
    if (score >= 70) return Math.round(xpBase * 0.75)  // 75%
    if (score >= 50) return Math.round(xpBase * 0.40)  // 40%
    return 0
  },
}
