import ContentRenderer from './ContentRenderer'
import Exercise from './Exercise'
import Countdown from './Countdown'

const DIFFICULTY_COLOR = {
  'Débutant': 'var(--green)',
  'Intermédiaire': 'var(--orange)',
  'Avancé': 'var(--red)',
}

export default function CourseContent({
  course,
  status,
  hintsUsed,
  isCompleted,
  onComplete,
  onUseHint,
  onNavigate,
  courses,
  getCourseStatus,
}) {
  const prevCourse = courses.find(c => c.id === course.id - 1)
  const nextCourse = courses.find(c => c.id === course.id + 1)
  const nextStatus = nextCourse ? getCourseStatus(nextCourse) : null

  // Time-locked: show locked message
  if (status === 'time-locked') {
    return (
      <div className="course-page">
        <div className="locked-overlay" style={{ marginTop: '60px' }}>
          <div className="lock-icon-wrap">🔒</div>
          <div className="locked-title">Cours {course.id} — {course.title}</div>
          <p className="locked-sub">
            Ce cours n'est pas encore disponible. Il sera publié le{' '}
            <strong>{new Date(course.releaseDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>{' '}
            à 18h (heure de Paris).
          </p>
          <Countdown targetDate={course.releaseDate} />
        </div>
      </div>
    )
  }

  // Exercise-locked
  if (status === 'exercise-locked') {
    return (
      <div className="course-page">
        <div className="locked-overlay" style={{ marginTop: '60px' }}>
          <div className="lock-icon-wrap">⚑</div>
          <div className="locked-title">Cours {course.id} — {course.title}</div>
          <p className="locked-sub">
            Pour accéder à ce cours, vous devez d'abord valider l'exercice du{' '}
            <strong>Cours {course.id - 1}</strong>.
          </p>
          {prevCourse && (
            <button className="btn btn-primary" onClick={() => onNavigate(prevCourse.id)}>
              ← Aller au Cours {prevCourse.id}
            </button>
          )}
        </div>
      </div>
    )
  }

  // Coming soon (released but no content)
  if (!course.content || course.content.length === 0) {
    return (
      <div className="course-page">
        <div className="locked-overlay" style={{ marginTop: '60px' }}>
          <div className="lock-icon-wrap">✏</div>
          <div className="locked-title">Cours {course.id} — {course.title}</div>
          <p className="locked-sub">
            Ce cours sera publié le{' '}
            <strong>{new Date(course.releaseDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>{' '}
            à 18h. Revenez dans quelques jours !
          </p>
          <Countdown targetDate={course.releaseDate} />
        </div>
      </div>
    )
  }

  return (
    <div className="course-page">
      {/* Breadcrumb + progress dots */}
      <div className="course-breadcrumb">
        <span
          style={{ cursor: 'pointer', color: 'var(--text-3)' }}
          onClick={() => onNavigate(null)}
        >
          RE Academy
        </span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Cours {course.id}</span>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          {courses.filter(c => new Date() >= new Date(c.releaseDate) && c.content?.length > 0).map(c => {
            const s = getCourseStatus(c)
            return (
              <div
                key={c.id}
                className={`pdot ${s === 'completed' ? 'done' : c.id === course.id ? 'current' : ''}`}
                onClick={() => s !== 'exercise-locked' && onNavigate(c.id)}
                title={c.title}
              />
            )
          })}
        </div>
      </div>

      {/* Header */}
      <div className="course-header">
        <div className="course-number-badge">COURS {String(course.id).padStart(2, '0')}</div>
        <h1 className="course-title">{course.title}</h1>
        <p className="course-subtitle">{course.subtitle}</p>
        <div className="course-meta">
          <span className="meta-tag">
            <span className="dot" />
            {course.duration}
          </span>
          <span className="meta-tag" style={{ color: DIFFICULTY_COLOR[course.difficulty] }}>
            ◆ {course.difficulty}
          </span>
          {course.tags.map(tag => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
          {isCompleted && (
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
              ✓ Complété
            </span>
          )}
        </div>
      </div>

      <div className="course-divider" />

      {/* Content */}
      <ContentRenderer blocks={course.content} />

      {/* Exercise */}
      {course.exercise && (
        <Exercise
          exercise={course.exercise}
          courseId={course.id}
          hintsUsed={hintsUsed}
          isCompleted={isCompleted}
          onComplete={onComplete}
          onUseHint={onUseHint}
        />
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border-1)' }}>
        <div>
          {prevCourse && (
            <button className="btn btn-ghost" onClick={() => onNavigate(prevCourse.id)}>
              ← Cours {prevCourse.id}
            </button>
          )}
        </div>
        <div>
          {nextCourse && nextStatus !== 'time-locked' && nextStatus !== 'exercise-locked' && (
            <button className="btn btn-primary" onClick={() => onNavigate(nextCourse.id)}>
              Cours {nextCourse.id} →
            </button>
          )}
          {nextCourse && nextStatus === 'time-locked' && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>Prochain cours dans :</div>
              <Countdown targetDate={nextCourse.releaseDate} />
            </div>
          )}
          {nextCourse && nextStatus === 'exercise-locked' && (
            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>
              Validez l'exercice ci-dessus pour continuer
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
