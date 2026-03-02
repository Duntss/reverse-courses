import Countdown from './Countdown'

const DIFFICULTY_COLOR = {
  'Débutant': '#00e676',
  'Intermédiaire': '#ffa657',
  'Avancé': '#f85149',
}

export default function Sidebar({ courses, selectedId, onSelect, getCourseStatus, completedCount, releasedCount, isOpen }) {
  const pct = releasedCount > 0 ? Math.round((completedCount / releasedCount) * 100) : 0

  // Find the next upcoming (time-locked) course
  const nextLocked = courses.find(c => getCourseStatus(c) === 'time-locked')

  return (
    <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-inner">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-hex">RE</div>
            <span className="logo-title">RE Academy</span>
          </div>
          <div className="logo-sub">formation · reverse engineering</div>
        </div>

        {/* Progress */}
        <div className="sidebar-progress-section">
          <div className="progress-label">
            <span>Progression</span>
            <span>{completedCount}/{releasedCount}</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Course list */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Cours</div>
          {courses.map(course => {
            const status = getCourseStatus(course)
            const isLocked = status === 'time-locked' || status === 'exercise-locked'
            const isActive = course.id === selectedId

            return (
              <div
                key={course.id}
                className={`course-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                onClick={() => !isLocked && onSelect(course.id)}
                title={isLocked ? (status === 'time-locked' ? `Disponible le ${new Date(course.releaseDate).toLocaleDateString('fr-FR')}` : 'Complétez l\'exercice précédent') : course.title}
              >
                <span className="course-num">{String(course.id).padStart(2, '0')}</span>

                <div className="course-info">
                  <div className="course-item-title">{course.title}</div>
                  {status === 'time-locked' && (
                    <div className="course-item-sub">
                      <Countdown targetDate={course.releaseDate} className="countdown-sm" />
                    </div>
                  )}
                  {status === 'exercise-locked' && (
                    <div className="course-item-sub" style={{ color: 'var(--text-3)' }}>
                      ↑ exercice requis
                    </div>
                  )}
                  {(status === 'available' || status === 'completed') && (
                    <div className="course-item-sub" style={{ color: DIFFICULTY_COLOR[course.difficulty] || 'var(--text-3)', opacity: 0.7 }}>
                      {course.difficulty} · {course.duration}
                    </div>
                  )}
                </div>

                <div className="course-status-icon">
                  {status === 'completed' && <div className="status-done">✓</div>}
                  {status === 'available' && <div className="status-current" />}
                  {(status === 'time-locked' || status === 'exercise-locked') && (
                    <span className="status-lock">🔒</span>
                  )}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Footer: next release */}
        {nextLocked && (
          <div className="sidebar-footer">
            <div className="next-release-label">Prochain cours</div>
            <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '5px', fontWeight: 500 }}>
              {nextLocked.title}
            </div>
            <Countdown targetDate={nextLocked.releaseDate} />
          </div>
        )}
      </div>
    </aside>
  )
}
