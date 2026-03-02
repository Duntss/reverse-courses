import Countdown from './Countdown'

const STATUS_LABEL = {
  completed: { label: 'Terminé', color: 'var(--green)' },
  available: { label: 'Disponible', color: 'var(--blue)' },
  'time-locked': { label: 'À venir', color: 'var(--yellow)' },
  'exercise-locked': { label: 'Verrouillé', color: 'var(--text-3)' },
}

export default function Welcome({ courses, getCourseStatus, completedCount, releasedCount, onSelect }) {
  const nextAvailable = courses.find(c => getCourseStatus(c) === 'available')
  const nextLocked = courses.find(c => getCourseStatus(c) === 'time-locked')

  const now = new Date()
  const startDate = new Date(courses[0].releaseDate)
  const daysActive = Math.max(0, Math.round((now - startDate) / (1000 * 60 * 60 * 24)))

  return (
    <div className="welcome">
      {/* Hero */}
      <div className="welcome-hero">
        <div className="welcome-eyebrow">⬡ Formation continue</div>
        <h1 className="welcome-title">RE Academy</h1>
        <p className="welcome-desc">
          Une formation progressive en reverse engineering. Chaque semaine, un nouveau cours et un exercice pratique.
          Validez le flag pour débloquer la suite.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{completedCount}<span style={{ fontSize: '18px', color: 'var(--text-3)' }}>/{releasedCount}</span></div>
          <div className="stat-label">Exercices terminés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '24px' }}>
            {completedCount === 0 ? 'Débutant' : completedCount < 3 ? 'Apprenti' : completedCount < 5 ? 'Analyste' : 'Expert'}
          </div>
          <div className="stat-label">Niveau actuel</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{daysActive}</div>
          <div className="stat-label">Jours en formation</div>
        </div>
      </div>

      {/* Next action */}
      {nextAvailable && (
        <div className="welcome-next">
          <div className="welcome-next-label">↗ Continuer la formation</div>
          <div className="welcome-next-title">{nextAvailable.title}</div>
          <div className="welcome-next-sub">{nextAvailable.subtitle} · {nextAvailable.difficulty} · {nextAvailable.duration}</div>
          <button className="btn btn-primary btn-lg" onClick={() => onSelect(nextAvailable.id)}>
            {completedCount === 0 ? 'Commencer le cours 1' : `Reprendre — Cours ${nextAvailable.id}`} →
          </button>
        </div>
      )}

      {!nextAvailable && nextLocked && (
        <div className="welcome-next">
          <div className="welcome-next-label">⏳ Prochain cours</div>
          <div className="welcome-next-title">{nextLocked.title}</div>
          <div className="welcome-next-sub">Disponible dans :</div>
          <Countdown targetDate={nextLocked.releaseDate} />
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '10px' }}>
            Nouveau cours chaque mercredi à 18h (heure de Paris)
          </p>
        </div>
      )}

      {/* Course overview */}
      <div>
        <div className="overview-label">Tous les cours</div>
        <div className="courses-overview">
          {courses.map(course => {
            const status = getCourseStatus(course)
            const s = STATUS_LABEL[status]
            const locked = status === 'time-locked' || status === 'exercise-locked'

            return (
              <div
                key={course.id}
                className={`overview-item ${locked ? 'ov-locked' : ''}`}
                onClick={() => !locked && onSelect(course.id)}
              >
                <span className="ov-num" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)' }}>
                  {String(course.id).padStart(2, '0')}
                </span>
                <div className="ov-title">
                  {course.title}
                  {course.content.length === 0 && (
                    <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--text-3)' }}>• À paraître</span>
                  )}
                </div>
                <span className="ov-status" style={{ color: s?.color }}>
                  {status === 'time-locked' ? (
                    <Countdown targetDate={course.releaseDate} className="countdown-sm" />
                  ) : s?.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
