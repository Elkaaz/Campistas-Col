import { Link } from 'react-router-dom'
import { getXpProgress } from '../../lib/levels'
import { mockChallenges } from '../../services/challengesService'
import { mockLeaderboard } from '../../services/leaderboardService'

const userXp = 1320
const { currentLevel, nextLevel, percent } = getXpProgress(userXp)

const stats = [
  { label: 'XP total', value: String(userXp) },
  { label: 'Nivel', value: currentLevel.name },
  { label: 'Retos', value: '06' },
  { label: 'Quizzes', value: '03' },
]

export default function DashboardPage() {
  return (
    <div className="page-shell">
      <div className="topbar">
        <div>
          <span className="badge">Campamento Nacional</span>
          <h1>Dashboard</h1>
        </div>
        <Link to="/perfil" className="primary-button button-link">Mi perfil</Link>
      </div>

      <section className="stats-grid">
        {stats.map((item) => (
          <article className="card stat-card" key={item.label}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="card">
          <h2>Retos del día</h2>
          <ul className="list">
            {mockChallenges.map((challenge) => (
              <li key={challenge.id} className="list-item">
                <div>
                  <strong>{challenge.title}</strong>
                  <small>+{challenge.xp} XP</small>
                </div>
                <span className="status-tag">{challenge.status}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Progreso</h2>
          <div className="progress-box">
            <div className="progress-bar">
              <span style={{ width: `${percent}%` }} />
            </div>
            <p>
              {percent}% hacia {nextLevel ? nextLevel.name : 'máximo nivel'}
            </p>
          </div>
        </article>
      </section>

      <section className="card leaderboard-box">
        <h2>Leaderboard</h2>
        <ul className="leaderboard-list">
          {mockLeaderboard.map((entry, index) => (
            <li key={entry.name} className="leaderboard-item">
              <span className="rank">#{index + 1}</span>
              <div>
                <strong>{entry.name}</strong>
                <small>{entry.department}</small>
              </div>
              <div className="leaderboard-meta">
                <span>{entry.level}</span>
                <strong>{entry.xp} XP</strong>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
