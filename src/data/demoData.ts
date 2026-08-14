import type { CampistaProfile, Interaction, Post, Reto, User } from '../types'
import { LEVELS } from '../lib/constants'

/**
 * Datos de demostración del prototipo.
 *
 * Se usan cuando la app corre sin configuración de Firebase (modo demo),
 * de forma que la interfaz siempre tiene contenido para presentar.
 */

const photo = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`
const avatar = (seed: string) => `https://i.pravatar.cc/160?u=${seed}`

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000)

function baseUser(
  uid: string,
  displayName: string,
  xpTotal: number,
  departamento: string,
  municipio: string,
  nombreBosque: string,
  extra: Partial<User> = {},
): User {
  const nivel = [...Object.values(LEVELS)]
    .sort((a, b) => b.orden - a.orden)
    .find((level) => xpTotal >= level.xpRequerida) ?? LEVELS.semilla

  return {
    uid,
    displayName,
    email: `${uid}@campistas.demo`,
    avatar: avatar(uid),
    xpTotal,
    nivelActual: nivel.id,
    nivelOrden: nivel.orden,
    departamento,
    municipio,
    nombreBosque,
    tipoSangre: 'O+',
    eps: 'Nueva EPS',
    rol: 'campista',
    esLider: false,
    esComiteDeptal: false,
    biografia: 'Campista apasionado por la naturaleza y el servicio a la comunidad.',
    seguidores: 24,
    siguiendo: 31,
    cartillasCompletadas: 4,
    cartillasTotal: 8,
    quizzesCompletados: 6,
    quizzesTotal: 10,
    retosPublicados: 7,
    retosValidados: 5,
    perfilCompleto: true,
    activo: true,
    createdAt: daysAgo(220),
    updatedAt: daysAgo(2),
    ...extra,
  }
}

export const DEMO_USERS: User[] = [
  baseUser('demo_valentina', 'Valentina Ríos', 8420, 'Antioquia', 'Medellín', 'Bosque Aburrá', {
    habilidadEspecial: 'liderazgo',
    esLider: true,
    rol: 'lider_bosque',
    retosValidados: 18,
  }),
  baseUser('demo_santiago', 'Santiago Correa', 6100, 'Antioquia', 'Medellín', 'Bosque Aburrá', {
    habilidadEspecial: 'nudos',
  }),
  baseUser('demo_mariana', 'Mariana Ospina', 4300, 'Cundinamarca', 'Bogotá', 'Bosque Sabana', {
    habilidadEspecial: 'primeros_auxilios',
  }),
  baseUser('demo_juan', 'Juan Esteban Pérez', 2750, 'Valle del Cauca', 'Cali', 'Bosque Pacífico', {
    habilidadEspecial: 'fogatas',
  }),
  baseUser('demo_laura', 'Laura Gómez', 1580, 'Antioquia', 'Rionegro', 'Bosque Oriente', {
    habilidadEspecial: 'naturaleza',
  }),
  baseUser('demo_camilo', 'Camilo Restrepo', 940, 'Antioquia', 'Medellín', 'Bosque Aburrá', {
    habilidadEspecial: 'organización',
  }),
  baseUser('demo_sofia', 'Sofía Martínez', 460, 'Santander', 'Bucaramanga', 'Bosque Andino', {
    habilidadEspecial: 'creatividad',
  }),
  baseUser('demo_andres', 'Andrés Villa', 180, 'Antioquia', 'Medellín', 'Bosque Aburrá', {
    habilidadEspecial: 'expresión_cultural',
  }),
]

/** Usuario con el que se navega el prototipo cuando no hay Firebase. */
export const DEMO_CURRENT_USER = DEMO_USERS[1]

export const DEMO_CAMPISTA_PROFILE: CampistaProfile = {
  uid: DEMO_CURRENT_USER.uid,
  displayName: DEMO_CURRENT_USER.displayName,
  email: DEMO_CURRENT_USER.email,
  firstName: 'Santiago',
  lastName: 'Correa',
  role: 'campista',
  departamento: DEMO_CURRENT_USER.departamento,
  municipio: DEMO_CURRENT_USER.municipio,
  nivelActual: DEMO_CURRENT_USER.nivelActual,
  xpTotal: DEMO_CURRENT_USER.xpTotal,
  perfilCompleto: true,
  tipoSangre: 'O+',
  eps: 'Nueva EPS',
  alergias: 'Ninguna',
  contactoEmergencia: {
    nombre: 'Marta Correa',
    telefono: '3001234567',
    parentesco: 'Madre',
  },
  avatarUrl: DEMO_CURRENT_USER.avatar,
  bio: DEMO_CURRENT_USER.biografia,
  createdAt: daysAgo(220).toISOString(),
}

export const DEMO_RETOS: Reto[] = [
  {
    retoId: 'reto_fogata',
    titulo: 'Fogata Segura',
    descripcion: 'Construye una fogata segura siguiendo los protocolos de prevención.',
    tipo: 'fogata',
    nivelRecomendado: 'Tallo',
    xpRecompensa: 80,
    criteriosEvaluacion: 'Seguridad del entorno, construcción correcta y apagado completo.',
    imagenReferencia: photo('reto-fogata'),
    estado: 'activo',
    creadoPor: 'demo_valentina',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(30),
  },
  {
    retoId: 'reto_nudo',
    titulo: 'Nudo de Escuadra',
    descripcion: 'Domina el amarre de escuadra para construcciones campamentiles.',
    tipo: 'nudo',
    nivelRecomendado: 'Semilla',
    xpRecompensa: 60,
    criteriosEvaluacion: 'Amarre firme, vueltas parejas y remate correcto.',
    imagenReferencia: photo('reto-nudo'),
    estado: 'activo',
    creadoPor: 'demo_valentina',
    createdAt: daysAgo(80),
    updatedAt: daysAgo(20),
  },
  {
    retoId: 'reto_refugio',
    titulo: 'Refugio de Emergencia',
    descripcion: 'Construye un refugio funcional con recursos naturales del entorno.',
    tipo: 'refugio',
    nivelRecomendado: 'Hoja',
    xpRecompensa: 100,
    criteriosEvaluacion: 'Resistencia al clima, uso responsable de materiales y desmontaje.',
    imagenReferencia: photo('reto-refugio'),
    estado: 'activo',
    creadoPor: 'demo_valentina',
    createdAt: daysAgo(70),
    updatedAt: daysAgo(15),
  },
  {
    retoId: 'reto_huerta',
    titulo: 'Huerta Comunitaria',
    descripcion: 'Crea o mantén una huerta comunitaria en tu bosque local.',
    tipo: 'huerta',
    nivelRecomendado: 'Raíz',
    xpRecompensa: 90,
    criteriosEvaluacion: 'Siembra correcta, plan de riego y participación comunitaria.',
    imagenReferencia: photo('reto-huerta'),
    estado: 'activo',
    creadoPor: 'demo_valentina',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(10),
  },
  {
    retoId: 'reto_pa',
    titulo: 'Botiquín y Primeros Auxilios',
    descripcion: 'Arma un botiquín de campaña y demuestra tres maniobras básicas.',
    tipo: 'primeros_auxilios',
    nivelRecomendado: 'Flor',
    xpRecompensa: 120,
    criteriosEvaluacion: 'Contenido completo del botiquín y ejecución correcta de maniobras.',
    imagenReferencia: photo('reto-pa'),
    estado: 'activo',
    creadoPor: 'demo_valentina',
    createdAt: daysAgo(50),
    updatedAt: daysAgo(5),
  },
]

function buildPost(
  postId: string,
  author: User,
  reto: Reto,
  titulo: string,
  descripcion: string,
  fogatas: number,
  nudos: number,
  days: number,
): Post {
  const nivel = LEVELS[author.nivelActual]

  return {
    postId,
    uid: author.uid,
    autoresNombre: author.displayName,
    autoresAvatar: author.avatar,
    autoresNivel: nivel.nombre,
    autoresNivelColor: nivel.color,
    retoId: reto.retoId,
    retoTitulo: reto.titulo,
    retoTipo: reto.tipo,
    titulo,
    descripcion,
    imagenes: [photo(postId)],
    estado: 'validado',
    validadorUid: 'demo_valentina',
    validadorNombre: 'Valentina Ríos',
    fechaValidacion: daysAgo(days),
    comentarioValidacion: 'Excelente ejecución, cumple todos los criterios.',
    xpAsignado: reto.xpRecompensa,
    contadorFogatas: fogatas,
    contadorNudos: nudos,
    contadorComentarios: 0,
    municipio: author.municipio,
    departamento: author.departamento,
    tags: [reto.tipo],
    createdAt: daysAgo(days),
    updatedAt: daysAgo(days),
  }
}

export const DEMO_POSTS: Post[] = [
  buildPost(
    'post_1',
    DEMO_USERS[1],
    DEMO_RETOS[0],
    'Fogata en el campamento de Santa Elena',
    'Montamos el círculo de piedras, cortafuegos de un metro y apagado con agua y tierra. El humo se mantuvo controlado toda la noche.',
    34,
    12,
    1,
  ),
  buildPost(
    'post_2',
    DEMO_USERS[2],
    DEMO_RETOS[4],
    'Botiquín de patrulla listo para salida',
    'Armamos el botiquín completo y practicamos vendaje compresivo, inmovilización de antebrazo y posición lateral de seguridad.',
    21,
    9,
    2,
  ),
  buildPost(
    'post_3',
    DEMO_USERS[3],
    DEMO_RETOS[2],
    'Refugio en A con material caído',
    'Solo usamos ramas caídas y cuerda de sisal. Resistió una lluvia de dos horas sin filtrarse.',
    47,
    18,
    3,
  ),
  buildPost(
    'post_4',
    DEMO_USERS[4],
    DEMO_RETOS[3],
    'Huerta del bosque Oriente',
    'Sembramos cilantro, lechuga y tomate cherry con la comunidad del barrio. Quedó el plan de riego por turnos.',
    29,
    7,
    4,
  ),
  buildPost(
    'post_5',
    DEMO_USERS[5],
    DEMO_RETOS[1],
    'Amarre de escuadra para la mesa de campo',
    'Primera vez que hago el amarre completo sin ayuda. La mesa aguantó todos los platos de la patrulla.',
    18,
    26,
    5,
  ),
  buildPost(
    'post_6',
    DEMO_USERS[6],
    DEMO_RETOS[0],
    'Fogata de consejo en Bucaramanga',
    'Fogata tipo pagoda para la noche de consejo, con turnos de vigilancia y apagado documentado.',
    15,
    5,
    6,
  ),
]

export const DEMO_INTERACTIONS: Interaction[] = [
  {
    interactionId: 'int_1',
    uid: DEMO_USERS[0].uid,
    usuarioNombre: DEMO_USERS[0].displayName,
    usuarioAvatar: DEMO_USERS[0].avatar,
    postId: 'post_3',
    tipo: 'fogata',
    createdAt: daysAgo(3),
  },
]
