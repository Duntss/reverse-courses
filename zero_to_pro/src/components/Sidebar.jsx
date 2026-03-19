const DIFFICULTY_COLOR = {
  'Débutant': '#00e676',
  'Intermédiaire': '#ffa657',
  'Avancé': '#f85149',
}

export default function Sidebar({ courses, selectedId, onSelect, getCourseStatus, completedCount, isOpen }) {
  const total = courses.filter(c => c.content?.length > 0).length
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0

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
            <span>{completedCount}/{total}</span>
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
            const isActive = course.id === selectedId
            const hasContent = course.content?.length > 0

            return (
              <div
                key={course.id}
                className={`course-item ${isActive ? 'active' : ''} ${!hasContent ? 'locked' : ''}`}
                onClick={() => hasContent && onSelect(course.id)}
                title={course.title}
              >
                <span className="course-num">{String(course.id).padStart(2, '0')}</span>

                <div className="course-info">
                  <div className="course-item-title">{course.title}</div>
                  <div className="course-item-sub" style={{ color: DIFFICULTY_COLOR[course.difficulty] || 'var(--text-3)', opacity: 0.7 }}>
                    {hasContent ? `${course.difficulty} · ${course.duration}` : 'À paraître'}
                  </div>
                </div>

                <div className="course-status-icon">
                  {status === 'completed' && <div className="status-done">✓</div>}
                  {status === 'available' && hasContent && <div className="status-current" />}
                </div>
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
