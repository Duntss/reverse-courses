import { useState } from 'react'

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="content-code-block">
      <div className="code-header">
        <span className="code-lang">{lang}</span>
        <button className="code-copy" onClick={copy}>
          {copied ? '✓ copié' : 'copier'}
        </button>
      </div>
      <pre className="code-content">{code}</pre>
    </div>
  )
}

const CALLOUT_ICON = {
  info: 'ℹ',
  warning: '⚠',
  danger: '✕',
  success: '✓',
}

function Callout({ variant, title, text }) {
  return (
    <div className={`callout ${variant}`}>
      <span className="callout-icon">{CALLOUT_ICON[variant]}</span>
      <div className="callout-body">
        {title && <div className="callout-title">{title}</div>}
        <div className="callout-text" dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  )
}

function TableBlock({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto', margin: '16px 0' }}>
      <table className="content-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} dangerouslySetInnerHTML={{ __html: h }} />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} dangerouslySetInnerHTML={{ __html: cell }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ContentRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return <h2 key={i} className="content-h2">{block.text}</h2>
          case 'h3':
            return <h3 key={i} className="content-h3">{block.text}</h3>
          case 'p':
            return <p key={i} className="content-p" dangerouslySetInnerHTML={{ __html: block.html }} />
          case 'code':
            return <CodeBlock key={i} lang={block.lang} code={block.code} />
          case 'callout':
            return <Callout key={i} variant={block.variant} title={block.title} text={block.text} />
          case 'list':
            return (
              <ul key={i} className={`content-list ${block.ordered ? 'ordered' : ''}`}>
                {block.items.map((item, li) => (
                  <li key={li} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )
          case 'table':
            return <TableBlock key={i} headers={block.headers} rows={block.rows} />
          case 'divider':
            return <div key={i} className="content-divider" />
          default:
            return null
        }
      })}
    </div>
  )
}
