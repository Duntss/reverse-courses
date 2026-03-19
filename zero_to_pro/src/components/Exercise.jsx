import { useState } from 'react'

// NOTE: Flag validation is intentionally client-side for this demo.
// Move to a backend endpoint in production for real security.
function normalizeAddr(s) {
  // Accepte "0x1400016d0", "1400016D0", etc.
  return s.trim().toLowerCase().replace(/^0x/, '')
}

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

// ── Multi-question (type: 'multi') ───────────────────────────────
function MultiInput({ exercise, onAllCorrect }) {
  const questions = exercise.questions // [{ id, label, answer }]
  const [inputs, setInputs] = useState(() => Object.fromEntries(questions.map(q => [q.id, ''])))
  const [states, setStates] = useState(() => Object.fromEntries(questions.map(q => [q.id, 'idle'])))
  const [correct, setCorrect] = useState(() => Object.fromEntries(questions.map(q => [q.id, false])))

  const correctCount = Object.values(correct).filter(Boolean).length

  function submit(q) {
    if (correct[q.id]) return
    const val = inputs[q.id]
    const ok = normalizeAddr(val) === normalizeAddr(q.answer)
    if (ok) {
      setCorrect(prev => {
        const next = { ...prev, [q.id]: true }
        if (Object.values(next).every(Boolean)) {
          setTimeout(onAllCorrect, 600)
        }
        return next
      })
    } else {
      setStates(prev => ({ ...prev, [q.id]: 'error' }))
      setTimeout(() => setStates(prev => ({ ...prev, [q.id]: 'idle' })), 1800)
    }
  }

  function onKey(e, q) {
    if (e.key === 'Enter') submit(q)
  }

  return (
    <div className="flag-input-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div className="flag-input-label" style={{ marginBottom: 0 }}>Questions ({correctCount}/{questions.length})</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {questions.map(q => (
            <div
              key={q.id}
              style={{
                width: 10, height: 10, borderRadius: '50%',
                background: correct[q.id] ? 'var(--green)' : 'var(--border-1)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {questions.map(q => (
          <div
            key={q.id}
            style={{
              border: `1px solid ${correct[q.id] ? 'var(--green-border)' : 'var(--border-1)'}`,
              borderRadius: 'var(--radius)',
              padding: '12px 14px',
              background: correct[q.id] ? 'rgba(0,230,118,0.04)' : 'var(--bg-0)',
              transition: 'border-color 0.3s, background 0.3s',
            }}
          >
            <div style={{
              fontSize: '12px',
              color: correct[q.id] ? 'var(--green)' : 'var(--text-3)',
              fontFamily: 'var(--font-mono)',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span dangerouslySetInnerHTML={{ __html: q.label }} />
              {correct[q.id] && <span style={{ color: 'var(--green)' }}>✓ Correct</span>}
            </div>
            <div className="flag-input-row">
              <input
                type="text"
                className={`flag-input ${states[q.id] === 'error' ? 'error' : ''}`}
                placeholder="0x140001234"
                value={inputs[q.id]}
                onChange={e => setInputs(prev => ({ ...prev, [q.id]: e.target.value }))}
                onKeyDown={e => onKey(e, q)}
                disabled={correct[q.id]}
                spellCheck={false}
                autoComplete="off"
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-primary"
                onClick={() => submit(q)}
                disabled={correct[q.id] || !inputs[q.id].trim()}
              >
                {correct[q.id] ? '✓' : 'OK'}
              </button>
            </div>
            {states[q.id] === 'error' && (
              <div className="feedback-error" style={{ marginTop: '6px' }}>
                ✕ Adresse incorrecte — vérifiez dans IDA (format 0x1400XXXXX).
              </div>
            )}
          </div>
        ))}
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

  const badgeLabel = exercise.type === 'flag' ? '⚑ FLAG' : exercise.type === 'multi' ? '⊞ MULTI' : '? QCM'
  const badgeClass = exercise.type === 'flag' ? 'badge-flag' : exercise.type === 'multi' ? 'badge-flag' : 'badge-question'

  return (
    <div className="exercise-section">
      <div className="exercise-header">
        <div>
          <div className="exercise-label">Exercice Pratique</div>
          <div className="exercise-title">{exercise.title}</div>
        </div>
        <span className={`exercise-badge ${badgeClass}`}>
          {badgeLabel}
        </span>
      </div>

      <div className="exercise-body">
        {submitted ? (
          <div className="exercise-success">
            <div className="success-icon-wrap">✓</div>
            <div className="success-title">Exercice validé !</div>
            <p className="success-sub">
              Excellent travail. Votre progression a été enregistrée.
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
            {exercise.scenario && (
              <div className="exercise-scenario">
                <div className="exercise-scenario-label">Contexte</div>
                {exercise.scenario}
              </div>
            )}

            <p
              className="exercise-desc"
              dangerouslySetInnerHTML={{ __html: exercise.description }}
            />

            {exercise.downloadFile && (
              <div className="exercise-file-info">
                <span className="file-icon">◈</span>
                <span style={{ color: 'var(--text-3)' }}>Fichier :</span>
                <code>{exercise.downloadFile}</code>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-3)' }}>
                  Fourni par l'instructeur
                </span>
              </div>
            )}

            {exercise.hints && exercise.hints.length > 0 && (
              <HintSystem
                hints={exercise.hints}
                hintsUsed={hintsUsed}
                courseId={courseId}
                onUseHint={onUseHint}
              />
            )}

            {exercise.type === 'flag' && (
              <FlagInput exercise={exercise} onSubmit={handleSubmit} />
            )}
            {exercise.type === 'question' && (
              <QuestionInput exercise={exercise} onSubmit={handleSubmit} />
            )}
            {exercise.type === 'multi' && (
              <MultiInput exercise={exercise} onAllCorrect={handleSubmit} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
