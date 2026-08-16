import { CARTILLAS_LINKS, getCartillaColor } from '../../config/cartillasLinks'
import type { CampistaProfile } from '../../types'
import '../../styles/pages.css'

const ROL_LABELS: Record<string, string> = {
  campista: 'Campista',
  lider_bosque: 'Líder de Bosque',
  comite_departamental: 'Comité Departamental',
  admin: 'Admin',
}

const NIVEL_EMOJIS: Record<string, string> = {
  semilla: '🌱',
  raiz: '🌿',
  tallo: '🪵',
  hoja: '🍃',
  flor: '🌸',
  fruto: '🌳',
  honorario: '⭐',
}

function getNivelFromXp(xp: number): string {
  if (xp >= 15000) return 'fruto'
  if (xp >= 7500) return 'flor'
  if (xp >= 3500) return 'hoja'
  if (xp >= 1500) return 'tallo'
  if (xp >= 500) return 'raiz'
  return 'semilla'
}

export default function ProfileInsignias({ profile }: { profile: CampistaProfile }) {
  const nivel = getNivelFromXp(profile.xpTotal || 0)
  const disponibles = Object.entries(CARTILLAS_LINKS)
    .filter(([, meta]) => (meta as any).nivelMinimo === nivel || (meta as any).rolHabilita === profile.role)
    .map(([slug, meta]) => ({ slug, ...(meta as any) }))

  return (
    <div className="card" style={{ padding: 20, marginBottom: 24 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800 }}>
        🏅 Insignias disponibles
      </h3>
      <p style={{ margin: '0 0 16px', fontSize: 13, opacity: 0.7 }}>
        Cartillas accesibles para tu nivel <strong>{nivel}</strong> y rol <strong>{ROL_LABELS[profile.role] || profile.role}</strong>
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {disponibles.map((c) => (
          <div key={c.slug} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${getCartillaColor(c.slug)}`,
            borderRadius: 14,
            minWidth: 100,
          }}>
            <span style={{ fontSize: 28 }}>{c.icono}</span>
            <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>
              {c.nombre.split(' ').slice(0, 2).join(' ')}
            </span>
            <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700 }}>
              +{c.xpAlCompletar} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
