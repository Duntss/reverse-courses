import { useState } from 'react'

// NOTE: Flag validation is intentionally client-side for this demo.
// Move to a backend endpoint in production for real security.
function checkAnswer(exercise, input) {
  if (exercise.type === 'flag') {
    return input.trim().toUpperCase() === exercise.answer.toUpperCase()
  }
  if (exercise.type === 'question') {
    return input.trim().toUpperCase() === exercise.answer.toUpperCase()
  }
  return false
}

function HintSystem({ hints, hintsUsed, courseId, onUseHint }) {
  const revealed = Math.min(hintsUsed, hints.length)
  const canReveal = revealed < hints.length

  return (
    <div className="hints-section">
      <div className="hints-header">
        <span className="hints-label">Indices ({revealed}/{hints.length})</span>
        {canReveal && (
          <button
            className="btn btn-sm btn-outline-green"
            onClick={() => onUseHint(courseId, revealed)}
          >
            💡 Obtenir un indice
          </button>
        )}
      </div>

      {Array.from({ length: revealed }).map((_, i) => (
        <div key={i} className="hint-item">
          <span className="hint-num">#{i + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: hints[i] }} />
        </div>
      ))}

      {revealed === 0 && (
        <p style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
          Bloqué ? Les indices vous guideront sans spoiler la solution.
        </p>
      )}
    </div>
  )
}

function FlagInput({ exercise, onSubmit }) {
  const [value, setValue] = useState('')
  const [state, setState] = useState('idle') // idle | error

  function submit() {
    if (!value.trim()) return
    const ok = checkAnswer(exercise, value)
    if (ok) {
      onSubmit()
    } else {
      setState('error')
      setTimeout(() => setState('idle'), 1800)
    }
  }

  function onKey(e) {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className="flag-input-section">
      <div className="flag-input-label">Soumettre le flag</div>
      <div className="flag-input-row">
        <input
          type="text"
          className={`flag-input ${state === 'error' ? 'error' : ''}`}
          placeholder="FLAG{...}"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoComplete="off"
        />
        <button className="btn btn-primary" onClick={submit} disabled={!value.trim()}>
          Valider →
        </button>
      </div>
      {state === 'error' && (
        <div className="feedback-error">
          ✕ Flag incorrect. Vérifiez votre réponse.
        </div>
      )}
    </div>
  )
}

function QuestionInput({ exercise, onSubmit }) {
  const [selected, setSelected] = useState(null)
  const [state, setState] = useState('idle')

  function submit() {
    if (selected === null) return
    const ok = exercise.options[selected].toUpperCase() === exercise.answer.toUpperCase()
    if (ok) {
      onSubmit()
    } else {
      setState('error')
      setTimeout(() => setState('idle'), 1800)
    }
  }

  return (
    <div className="flag-input-section">
      {exercise.question && (
        <div style={{
          background: 'var(--bg-0)',
          border: '1px solid var(--border-1)',
          borderRadius: 'var(--radius)',
          padding: '14px 16px',
          marginBottom: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--text-1)',
          whiteSpace: 'pre-wrap',
        }}>
          {exercise.question}
        </div>
      )}

      <div className="choices">
        {exercise.options.map((opt, i) => (
          <div
            key={i}
            className={`choice-item ${selected === i ? 'selected' : ''}`}
            onClick={() => setSelected(i)}
          >
            <div className="choice-radio">
              {selected === i && <span />}
            </div>
            <code style={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}>{opt}</code>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          className="btn btn-primary"
          onClick={submit}
          disabled={selected === null}
        >
          Valider →
        </button>
        {state === 'error' && (
          <span className="feedback-error">✕ Réponse incorrecte, réessayez.</span>
        )}
      </div>
    </div>
  )
}

export default function Exercise({ exercise, courseId, hintsUsed, isCompleted, onComplete, onUseHint }) {
  const [submitted, setSubmitted] = useState(isCompleted)

  function handleSubmit() {
    setSubmitted(true)
    onComplete(courseId)
  }

  return (
    <div className="exercise-section">
      <div className="exercise-header">
        <div>
          <div className="exercise-label">Exercice Pratique</div>
          <div className="exercise-title">{exercise.title}</div>
        </div>
        <span className={`exercise-badge ${exercise.type === 'flag' ? 'badge-flag' : 'badge-question'}`}>
          {exercise.type === 'flag' ? '⚑ FLAG' : '? QCM'}
        </span>
      </div>

      <div className="exercise-body">
        {submitted ? (
          <div className="exercise-success">
            <div className="success-icon-wrap">✓</div>
            <div className="success-title">Exercice validé !</div>
            <p className="success-sub">
              Excellent travail. Votre progression a été enregistrée.<br />
              Le prochain cours sera disponible le mercredi suivant à 18h (heure de Paris).
            </p>
            {exercise.explanation && (
              <div style={{
                background: 'var(--bg-0)',
                border: '1px solid var(--green-border)',
                borderRadius: 'var(--radius)',
                padding: '14px 16px',
                marginTop: '16px',
                fontSize: '13px',
                color: 'var(--text-2)',
                textAlign: 'left',
                lineHeight: 1.6,
              }}>
                <strong style={{ color: 'var(--green)', display: 'block', marginBottom: '4px' }}>Explication :</strong>
                {exercise.explanation}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Scenario */}
            {exercise.scenario && (
              <div className="exercise-scenario">
                <div className="exercise-scenario-label">Contexte</div>
                {exercise.scenario}
              </div>
            )}

            {/* Description */}
            <p
              className="exercise-desc"
              dangerouslySetInnerHTML={{ __html: exercise.description }}
            />

            {/* Download file info */}
            {exercise.downloadFile && (
              <div className="exercise-file-info">
                <span className="file-icon">◈</span>
                <span style={{ color: 'var(--text-3)' }}>Fichier :</span>
                <code>{exercise.downloadFile}</code>
                {exercise.downloadUrl ? (
                  <a
                    href={exercise.downloadUrl}
                    download={exercise.downloadFile}
                    className="btn btn-sm btn-outline-green"
                    style={{ marginLeft: 'auto', textDecoration: 'none' }}
                  >
                    ↓ Télécharger
                  </a>
                ) : (
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-3)' }}>
                    Fourni par l'instructeur
                  </span>
                )}
              </div>
            )}

            {/* Hints */}
            {exercise.hints && exercise.hints.length > 0 && (
              <HintSystem
                hints={exercise.hints}
                hintsUsed={hintsUsed}
                courseId={courseId}
                onUseHint={onUseHint}
              />
            )}

            {/* Answer input */}
            {exercise.type === 'flag' && (
              <FlagInput exercise={exercise} onSubmit={handleSubmit} />
            )}
            {exercise.type === 'question' && (
              <QuestionInput exercise={exercise} onSubmit={handleSubmit} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
