import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { CARTILLAS_LINKS, getCartillaColor, getCartillaIcon, getCartillaName, getCartillaMeta } from '../../config/cartillasLinks'
import { LEVELS } from '../../lib/constants'
import QuizRunner from '../../components/quiz/QuizRunner'
import { quizService } from '../../services/quizService'
import '../../styles/pages.css'

export default function CartillaDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showQuiz, setShowQuiz] = useState(false)
  const [readingTime, setReadingTime] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [quizResult, setQuizResult] = useState<{ score: number; xp: number; badge?: string } | null>(null)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)

  // Cartilla data from config
  const cartillaMeta = slug ? getCartillaMeta(slug) : null
  const cartillaName = slug ? getCartillaName(slug) : 'Cartilla'
  const cartillaIcon = slug ? getCartillaIcon(slug) : '📚'
  const cartillaColor = slug ? getCartillaColor(slug) : '#228B22'
  const hasQuestions = slug ? quizService.getQuestionsByCartilla(slug).length > 0 : false
  
  // Cartilla content pages (enriquecido por cartilla)
  const CONTENT_MAP: Record<string, { page: number; title: string; content: string }[]> = {
    'tecnicas-campamentiles': [
      { page: 1, title: 'Introducción al Campismo', content: '## Fundamentos del Campismo\n\nLas técnicas campamentiles son el conjunto de habilidades, conocimientos y procedimientos que un campista debe dominar para desenvolverse de forma segura, eficiente y responsable en la naturaleza.\n\nEstas técnicas comprenden desde la instalación adecuada de un campamento hasta el manejo del fuego, la construcción de refugios de emergencia y la orientación en terrenos desconocidos.' },
      { page: 2, title: 'Instalación del Campamento', content: '## Selección y Preparación del Sitio\n\n1. **Terreno elevado y plano**: Evita zonas bajas propensas a inundaciones.\n2. **Distancia del agua**: Mínimo 30 metros de ríos, lagos o quebradas.\n3. **Protección del viento**: Busca refugio natural en árboles o colinas.\n4. **Acceso a recursos**: Agua potable cerca, pero no demasiado cerca.\n5. **Sin riesgos**: Evita árboles secos, colmenas o hormigueros.\n\n**Regla de oro**: Deja el sitio mejor de cómo lo encontraste.' },
      { page: 3, title: 'Nudos Esenciales', content: '## Los 5 Nudos que Todo Campista Debe Saber\n\n🪢 **As de Guía** — Para asegurar personas, no se cierra bajo carga.\n\n🪢 **Nudo Ballestrinque** — Para amarrar a postes y estacas.\n\n🪢 **Vuelta de Escota** — Para unir cuerdas de diferente grosor.\n\n🪢 **Nudo de Ocho** — Nudo de frenado, muy seguro.\n\n🪢 **Nudo Mariposa** — Para crear un lazo en el medio de una cuerda.\n\nPráctica: Cada nudo requiere repetición para que sea un reflejo automático.' },
      { page: 4, title: 'Fogata Segura y Leave No Trace', content: '## Fuego Responsable en el Campamento\n\n**Antes de encender fuego:**\n- Verifica que esté permitido en la zona.\n- Usa zonas designadas o construye un ring de piedras.\n- Ten agua cerca para apagar.\n\n**Principio Leave No Trace:**\nEl fuego deja cicatrices permanentes. Siempre:\n✓ Apaga completamente con agua\n✓ Revuelve las cenizas\n✓ Verifica que estén frías al tacto\n✓ Dispersa las cenizas si es posible\n\n**Nunca** dejes un fuego sin supervisión.' },
    ],
    'prevencion-salud': [
      { page: 1, title: 'Principios de Primeros Auxilios', content: '## Actuar en Emergencias\n\nLos primeros auxilios son la asistencia inmediata que se presta a una persona lesionada o enferma antes de que llegue ayuda profesional. El objetivo es preservar la vida, prevenir el agravamiento de lesiones y promover la recuperación.\n\n**Regla PAS:**\n🔵 **Proteger** — Asegura la escena antes de actuar.\n🟡 **Alertar** — Llama a emergencias: 123 (Colombia).\n🔴 **Socorrer** — Presta la atención necesaria.' },
      { page: 2, title: 'Hemorragias y Heridas', content: '## Control de Hemorragias\n\n**Pasos para controlar una hemorragia externa:**\n\n1. Usa guantes si los tienes disponibles.\n2. Aplica **presión directa y sostenida** con tela limpia.\n3. No retires la tela aunque se empape — añade encima.\n4. Eleva la extremidad si es posible.\n5. Solo aplica torniquete si la hemorragia no se controla.\n\n**Heridas infectadas** — Señales de alarma:\n⚠️ Calor excesivo\n⚠️ Enrojecimiento que se extiende\n⚠️ Pus o líquido maloliente\n⚠️ Fiebre' },
      { page: 3, title: 'Emergencias Ambientales', content: '## Insolación, Hipotermia y Deshidratación\n\n### Insolación\n- **Síntomas graves**: Piel seca y caliente, temperatura >40°C, confusión.\n- **Acción**: Llevar a la sombra, enfriar con agua fría, buscar ayuda médica urgente.\n\n### Hipotermia\n- **Síntomas**: Temblores intensos, piel fría y pálida, confusión, torpeza.\n- **Acción**: Retirar ropa mojada, arropar con mantas secas, bebidas calientes (si consciente).\n\n### Deshidratación\n- Bebe mínimo 2 litros de agua al día en campo.\n- Señal de alarma: orina oscura o ausencia de orina.' },
      { page: 4, title: 'Botiquín Campamentil', content: '## Equipamiento Médico Básico\n\nTodo campamento debe tener un botiquín con:\n\n**Materiales de curación:**\n- Gasas estériles y vendas\n- Cinta médica y esparadrapo\n- Guantes de látex (varios pares)\n- Solución salina y antiséptico (yodopovidona)\n\n**Medicamentos básicos:**\n- Analgésicos (acetaminofén / ibuprofeno)\n- Antihistamínico\n- Suero oral rehidratante\n\n**Herramientas:**\n- Tijeras punta roma\n- Pinzas\n- Termómetro\n- Máscara de RCP\n- Guía rápida de primeros auxilios' },
    ],
    'conciencia-ambiental': [
      { page: 1, title: 'Ecosistemas y Naturaleza', content: '## El Campista como Guardián del Planeta\n\nColombia posee una de las mayores biodiversidades del mundo. Como campistas, somos los primeros en sentir la riqueza de esta naturaleza y también los primeros responsables de su cuidado.\n\n**¿Por qué importa?**\nCada planta talada, cada residuo abandonado y cada fuente de agua contaminada afecta una cadena de vida entera. El campista consciente entiende que es parte del ecosistema, no un visitante ajeno.' },
      { page: 2, title: 'Leave No Trace — Los 7 Principios', content: '## Los 7 Principios Leave No Trace\n\n1. **Planifica y prepárate** — Conoce las regulaciones y el terreno.\n2. **Viaja y acampa en superficies resistentes** — Usa senderos y zonas designadas.\n3. **Maneja los residuos apropiadamente** — Empaca todo lo que entras.\n4. **Deja lo que encuentras** — No recojas plantas, rocas ni artefactos históricos.\n5. **Minimiza el impacto del fuego** — Prefiere cocina de gas, usa fogatas con prudencia.\n6. **Respeta la vida silvestre** — No alimentes animales salvajes.\n7. **Sé considerado con otros** — El ruido y las acciones afectan la experiencia de todos.' },
      { page: 3, title: 'Gestión de Residuos', content: '## Cero Basura en el Campamento\n\n**Regla básica**: Lo que entras, lo sacas.\n\n**Residuos orgánicos:**\nEntierra a 15-20 cm de profundidad, a más de 60 m de fuentes de agua, senderos y campamentos.\n\n**Residuos sólidos:**\nClasifica en bolsas herméticas: plástico, papel, metal. Lleva todo de vuelta.\n\n**Aguas grises** (jabón, cocina):\nUsa jabón biodegradable y dispersa lejos de fuentes de agua.\n\n**Nunca:** Entierres basura no biodegradable ni quemes plásticos.' },
      { page: 4, title: 'Agua y Recursos Naturales', content: '## Uso Responsable del Agua\n\nEl agua es el recurso más valioso en el campamento. Cuídala:\n\n**Potabilización:**\n- Hervir 3 min (5 min sobre 2000 msnm)\n- Pastillas de cloro o yodo\n- Filtros de membrana\n\n**Ahorro:**\n- Usa lo mínimo necesario para higiene.\n- No contamines fuentes con jabón, residuos ni químicos.\n\n**Impacto en fauna:**\nLas fuentes de agua son vitales para la vida silvestre. Mantén distancia y limpieza en todo momento.' },
    ],
    'formacion-liderazgo': [
      { page: 1, title: 'El Líder Campista', content: '## Liderazgo desde la Naturaleza\n\nEl campismo es un laboratorio natural de liderazgo. Lejos de la comodidad urbana, las habilidades de dirección, comunicación y trabajo en equipo se ponen a prueba en situaciones reales.\n\nUn líder campista no es el que manda — es el que **sirve, inspira y facilita** que el grupo llegue a su destino, literal y metafóricamente.' },
      { page: 2, title: 'Comunicación Efectiva', content: '## Herramientas de Comunicación para Líderes\n\n**Escucha activa:**\n- Contacto visual y lenguaje corporal abierto.\n- Preguntas abiertas: "¿Cómo te sentiste con...?"\n- Paráfrasis: "Si entendí bien, dices que..."\n\n**Comunicación no violenta (CNV):**\n1. Observación (sin juicio)\n2. Sentimiento (lo que siento)\n3. Necesidad (lo que necesito)\n4. Petición (lo que solicito)\n\n**Feedback constructivo:**\n- Específico, no general.\n- Basado en comportamientos, no en personas.\n- Oportuno y respetuoso.' },
      { page: 3, title: 'Resolución de Conflictos', content: '## Conflictos como Oportunidad de Crecimiento\n\nLos conflictos son inevitables en grupos. La clave está en cómo se gestionan.\n\n**Pasos para resolver conflictos:**\n1. Crear un espacio seguro para hablar.\n2. Escuchar a todas las partes sin interrumpir.\n3. Identificar el problema real (no las posiciones).\n4. Buscar opciones de solución en conjunto.\n5. Acordar compromisos concretos.\n\n**Estilos de manejo de conflictos:**\n- Evasión, Acomodación, Competencia, Compromiso, **Colaboración** (ideal).' },
      { page: 4, title: 'Voluntariado y Servicio', content: '## El Campista que Transforma su Comunidad\n\nEl voluntariado es la expresión práctica de los valores campistas. A través del servicio:\n\n✅ Desarrollas empatía y perspectiva.\n✅ Fortaleces tu comunidad local.\n✅ Construyes habilidades transferibles al mundo laboral.\n✅ Dejas un legado positivo.\n\n**Tipos de voluntariado campista:**\n- Talleres de naturaleza para niños\n- Jornadas de limpieza ambiental\n- Apoyo a campamentos para personas vulnerables\n- Formación de nuevos líderes\n\n"El servicio es la renta que pagamos por vivir en este planeta." — M. Ali' },
    ],
    'guia-tecnica': [
      { page: 1, title: 'Marco Institucional', content: '## Programa Nacional de Campamentos Juveniles\n\nEl Ministerio del Deporte de Colombia (MinDeporte) lidera el **Programa Nacional de Campamentos Juveniles**, una iniciativa que busca promover el desarrollo integral de niños y jóvenes colombianos a través de actividades al aire libre, basadas en valores como:\n\n🌱 Respeto por la naturaleza\n🤝 Trabajo en equipo\n🏕️ Liderazgo juvenil\n💪 Superación personal\n\nEl programa opera en los 32 departamentos del país.' },
      { page: 2, title: 'Estructura del Programa', content: '## Niveles y Roles del Programa\n\n**Niveles de participación:**\n- Semilla (0-499 XP): Ingreso al programa\n- Raíz (500-1499 XP): Consolidación básica\n- Tallo (1500-3499 XP): Habilidades intermedias\n- Hoja (3500-7499 XP): Expansión y liderazgo\n- Flor (7500-14999 XP): Madurez y formación\n- Fruto (15000+ XP): Excelencia campista\n\n**Roles:**\n- Campista: Participante activo\n- Líder de Bosque: Guía de grupos locales\n- Comité Departamental: Coordinación regional\n- Administrador: Gestión nacional' },
      { page: 3, title: 'Organización de Campamentos', content: '## Requisitos para Campamentos Oficiales\n\nPara organizar un campamento con reconocimiento oficial se requiere:\n\n📋 **Documentación:**\n- Plan de actividades detallado\n- Autorizaciones firmadas de padres/acudientes\n- Póliza o seguro médico vigente\n- Ficha médica de cada participante\n\n👑 **Personal:**\n- Mínimo un Líder de Bosque certificado\n- Ratio adulto-joven: 1:8 (máximo)\n\n📍 **Logística:**\n- Lugar aprobado por autoridades locales\n- Plan de emergencias y evacuación\n- Primeros auxilios disponibles' },
      { page: 4, title: 'Certificación y Reconocimiento', content: '## Camino a la Certificación\n\n**Proceso de certificación:**\n1. Completar las 5 cartillas de formación\n2. Aprobar los quizzes con mínimo 70%\n3. Participar en al menos 2 campamentos\n4. Completar 20 horas de servicio voluntario\n5. Presentar portafolio de evidencias\n\n**Beneficios de la certificación:**\n- Reconocimiento oficial de MinDeporte\n- Habilita para liderar grupos\n- Acceso a campamentos nacionales\n- Red de campistas a nivel nacional\n- Cuenta en hoja de vida y proyectos estudiantiles' },
    ],
  }

  const cartillaContent = CONTENT_MAP[slug || ''] || [
    { page: 1, title: 'Introducción', content: `## ${cartillaName}\n\nContenido de formación campamentil.` },
    { page: 2, title: 'Desarrollo', content: '## Desarrollo\n\nPractica y aprende con tus compañeros campistas.' },
    { page: 3, title: 'Conclusión', content: '## Conclusión\n\nAplica lo aprendido en tu próximo campamento.' },
  ]

  // Calculate progress percentage
  const totalPages = cartillaContent.length
  const progressPercentage = Math.round((currentPage / totalPages) * 100)

  useEffect(() => {
    if (!slug) { setError('No se encontró la cartilla'); setLoading(false); return }
    if (!cartillaMeta) { setError(`Cartilla "${slug}" no encontrada`); setLoading(false); return }

    // Check if user meets level requirements
    if (profile && cartillaMeta.nivelMinimo) {
      const nivelOrden = Object.values(LEVELS).find(l => l.id === cartillaMeta.nivelMinimo)?.orden || 0
      const userNivelOrden = Object.values(LEVELS).find(l => l.id === profile.nivelActual)?.orden || 0
      if (userNivelOrden < nivelOrden) {
        setError(`Necesitas alcanzar el nivel "${cartillaMeta.nivelMinimo}" para acceder a esta cartilla.`)
        setLoading(false)
        return
      }
    }

    // Check Firestore for existing progress
    if (user) {
      quizService.getUserCartillaProgress(user.uid, slug).then((prog) => {
        if (prog?.completada) setAlreadyCompleted(true)
      })
    }

    // Reading timer (minutes)
    const id = setInterval(() => setReadingTime(t => t + 1), 60000)
    setLoading(false)
    return () => clearInterval(id)
  }, [slug, user, profile])

  const handlePageChange = (dir: 'prev' | 'next') => {
    if (dir === 'prev' && currentPage > 1) setCurrentPage(p => p - 1)
    else if (dir === 'next' && currentPage < totalPages) setCurrentPage(p => p + 1)
  }

  const handleCompleteReading = () => setShowQuiz(true)

  const handleQuizComplete = (score: number, xp: number, badge?: string) => {
    setQuizResult({ score, xp, badge })
    setQuizDone(true)
    setShowQuiz(false)
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="loading-spinner">Cargando cartilla...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-shell">
        <div className="error-state">
          <h2>🚫 Acceso Restringido</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/aprendizaje')} className="btn-primary">
            Volver a Formación
          </button>
        </div>
      </div>
    )
  }

  const currentContent = cartillaContent[currentPage - 1]

  return (
    <div className="cartilla-detail-page">
      {/* Header */}
      <div className="cartilla-header" style={{ background: `linear-gradient(135deg, ${cartillaColor} 0%, ${cartillaColor}cc 100%)` }}>
        <div className="cartilla-header-content">
          <button onClick={() => navigate('/aprendizaje')} className="back-btn">← Volver</button>
          <div className="cartilla-title-section">
            <h1><span className="cartilla-icon">{cartillaIcon}</span> {cartillaName}</h1>
            <p className="cartilla-subtitle">
              {cartillaMeta?.tiempoEstimadoMin ? `~${cartillaMeta.tiempoEstimadoMin} min de lectura` : 'Formación campamentil'}
              {alreadyCompleted && <span style={{ marginLeft: 8, background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>✅ Ya completada</span>}
            </p>
          </div>
          <div className="cartilla-meta">
            <span className="meta-badge">Nivel: {cartillaMeta?.nivelMinimo || 'semilla'}</span>
            <span className="meta-badge">+{cartillaMeta?.xpAlCompletar || 100} XP</span>
          </div>
        </div>
        <div className="reading-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
          <div className="progress-info">
            <span>Página {currentPage} de {totalPages}</span>
            <span>{progressPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Quiz completed result banner */}
      {quizDone && quizResult && (
        <div className={`quiz-result-banner ${quizResult.score >= 70 ? 'banner-pass' : 'banner-fail'}`}>
          {quizResult.score >= 70 ? (
            <>🏆 ¡Quiz aprobado con {quizResult.score}%! Ganaste <strong>+{quizResult.xp} XP</strong>{quizResult.badge ? ` y la insignia "${quizResult.badge}"` : ''}.</>
          ) : (
            <>📚 Obtuviste {quizResult.score}%. Relee la cartilla y vuelve a intentarlo (mínimo 70%).</>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="cartilla-content-area">
        {/* Reader */}
        <div className="cartilla-reader">
          <div className="reader-header">
            <h2>{currentContent.title}</h2>
            <div className="reader-stats">
              <span>⏱️ {readingTime} min</span>
              <span>{currentPage}/{totalPages}</span>
            </div>
          </div>

          <div className="reader-content">
            <div className="content-box" style={{ borderColor: cartillaColor }}>
              {currentContent.content.split('\n').map((line, idx) => {
                if (line.startsWith('## ')) return <h2 key={idx} style={{ color: cartillaColor }}>{line.substring(3)}</h2>
                if (line.startsWith('### ')) return <h3 key={idx}>{line.substring(4)}</h3>
                if (line.startsWith('- ') || line.match(/^\d+\./)) return <p key={idx} style={{ paddingLeft: 16 }}>{line}</p>
                if (line.trim()) return <p key={idx}>{line}</p>
                return <br key={idx} />
              })}
            </div>
          </div>

          <div className="reader-controls">
            <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1} className="page-btn" style={{ borderColor: cartillaColor, color: cartillaColor }}>
              ← Anterior
            </button>
            {currentPage === totalPages ? (
              hasQuestions ? (
                <button onClick={handleCompleteReading} className="complete-btn" style={{ backgroundColor: cartillaColor }}>
                  ✅ Tomar Quiz y Ganar XP
                </button>
              ) : (
                <a href={cartillaMeta?.enlacePdf || '#'} target="_blank" rel="noopener noreferrer" className="complete-btn" style={{ backgroundColor: cartillaColor, textDecoration: 'none' }}>
                  📥 Descargar PDF Oficial
                </a>
              )
            ) : (
              <button onClick={() => handlePageChange('next')} className="page-btn" style={{ borderColor: cartillaColor, color: cartillaColor }}>
                Siguiente →
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="cartilla-sidebar">
          <h3>Contenido</h3>
          <ul className="toc-list">
            {cartillaContent.map((item) => (
              <li key={item.page} className={item.page === currentPage ? 'active' : ''} onClick={() => setCurrentPage(item.page)}>
                <span className="page-number" style={{ background: item.page <= currentPage ? cartillaColor : undefined, color: item.page <= currentPage ? 'white' : undefined }}>{item.page}</span>
                <span className="page-title">{item.title}</span>
                {item.page < currentPage && <span className="checkmark" style={{ color: cartillaColor }}>✓</span>}
              </li>
            ))}
          </ul>

          <div className="reading-stats">
            <h4>Tu Progreso</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Páginas</span>
                <span className="stat-value">{currentPage}/{totalPages}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tiempo</span>
                <span className="stat-value">{readingTime} min</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">XP potencial</span>
                <span className="stat-value" style={{ color: cartillaColor }}>+{cartillaMeta?.xpAlCompletar || 100}</span>
              </div>
            </div>
          </div>

          {/* PDF download link */}
          {cartillaMeta?.enlacePdf && (
            <a href={cartillaMeta.enlacePdf} target="_blank" rel="noopener noreferrer" className="btn-leer" style={{ background: cartillaColor, display: 'block', marginTop: 16, textAlign: 'center' }}>
              📥 Descargar PDF Oficial
            </a>
          )}
        </div>
      </div>

      {/* Quiz Runner (modal overlay) */}
      {showQuiz && slug && (
        <QuizRunner
          cartillaId={slug}
          cartillaName={cartillaName}
          cartillaColor={cartillaColor}
          xpBase={cartillaMeta?.xpAlCompletar || 100}
          insignia={cartillaMeta?.insigniaOtorgada}
          onComplete={handleQuizComplete}
          onCancel={() => setShowQuiz(false)}
        />
      )}
    </div>
  )
}