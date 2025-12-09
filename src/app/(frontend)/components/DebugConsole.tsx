'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type LogLevel = 'log' | 'info' | 'warn' | 'error'

type LogEntry = {
  id: number
  level: LogLevel
  message: string
  timestamp: string
}

const MAX_LOGS = 200
const STORAGE_KEY = 'ncg-debug-console'

/**
 * Lightweight in-browser debug console.
 * - Works in dev and production (no server/Redis dependency).
 * - Enabled via `?debug=1` or by persisting the toggle (stored in localStorage).
 * - Captures console logs/errors plus window errors/rejections.
 * - Never sent to a server; everything stays client-side.
 */
export function DebugConsole() {
  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const originalsRef = useRef<Partial<Console>>({})

  // Determine initial enable flag on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const fromQuery = params.get('debug') === '1'
    const fromStorage = window.localStorage.getItem(STORAGE_KEY) === 'on'
    const shouldEnable = fromQuery || fromStorage

    setEnabled(shouldEnable)
    setOpen(shouldEnable)

    // If user explicitly enabled via query, persist for subsequent navigations
    if (fromQuery) {
      window.localStorage.setItem(STORAGE_KEY, 'on')
    }
  }, [])

  const addLog = useCallback((level: LogLevel, args: any[]) => {
    setLogs((prev) => {
      const message =
        args
          .map((arg) => {
            try {
              if (typeof arg === 'string') return arg
              return JSON.stringify(arg)
            } catch {
              return String(arg)
            }
          })
          .join(' ') || '(no message)'

      const entry: LogEntry = {
        id: Date.now() + Math.random(),
        level,
        message,
        timestamp: new Date().toLocaleTimeString(),
      }

      const next = [...prev, entry]
      if (next.length > MAX_LOGS) {
        next.splice(0, next.length - MAX_LOGS)
      }
      return next
    })
  }, [])

  // Hook into console and global error handlers
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const levels: LogLevel[] = ['log', 'info', 'warn', 'error']
    const originals: Partial<Console> = {}

    levels.forEach((level) => {
      const original = console[level] as (...args: any[]) => void
      originals[level] = original
      console[level] = (...args: any[]) => {
        addLog(level, args)
        original?.(...args)
      }
    })

    const handleError = (event: ErrorEvent) => {
      addLog('error', [event.message || 'Unknown error'])
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      addLog('error', ['Unhandled rejection', event.reason || '(no reason)'])
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)
    originalsRef.current = originals

    return () => {
      // Restore console methods
      levels.forEach((level) => {
        const original = originals[level]
        if (original) {
          console[level] = original as any
        }
      })
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [addLog, enabled])

  const clear = useCallback(() => setLogs([]), [])

  const disable = useCallback(() => {
    setEnabled(false)
    setOpen(false)
    setLogs([])
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const badgeStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'fixed',
      bottom: '16px',
      right: open ? '320px' : '16px',
      zIndex: 99998,
      background: '#111827',
      color: '#e5e7eb',
      border: '1px solid #374151',
      borderRadius: '999px',
      padding: '8px 14px',
      fontSize: '13px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
      cursor: 'pointer',
      opacity: 0.9,
    }),
    [open]
  )

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    width: '300px',
    height: '280px',
    zIndex: 99999,
    background: '#0b0f19',
    color: '#e5e7eb',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    boxShadow: '0 20px 45px rgba(0,0,0,0.45)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    opacity: 0.96,
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 10px',
    borderBottom: '1px solid #1f2937',
    background: '#111827',
    fontSize: '13px',
    gap: '8px',
  }

  const buttonStyle: React.CSSProperties = {
    background: '#1f2937',
    color: '#e5e7eb',
    border: '1px solid #374151',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '12px',
    cursor: 'pointer',
  }

  const logAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '8px',
    fontSize: '12px',
    lineHeight: 1.4,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  }

  const levelColor: Record<LogLevel, string> = {
    log: '#9ca3af',
    info: '#60a5fa',
    warn: '#fbbf24',
    error: '#f87171',
  }

  if (!enabled) return null

  return (
    <>
      <button style={badgeStyle} onClick={() => setOpen((v) => !v)}>
        {open ? 'Hide Debug' : 'Show Debug'}
      </button>

      {open && (
        <div style={panelStyle}>
          <div style={headerStyle}>
            <span style={{ fontWeight: 600 }}>Debug Console</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button style={buttonStyle} onClick={clear}>
                Clear
              </button>
              <button style={buttonStyle} onClick={disable}>
                Disable
              </button>
            </div>
          </div>
          <div style={logAreaStyle}>
            {logs.length === 0 && <div style={{ color: '#6b7280' }}>No logs yet.</div>}
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  marginBottom: '6px',
                  color: levelColor[log.level],
                  wordBreak: 'break-word',
                }}
              >
                <span style={{ color: '#9ca3af' }}>[{log.timestamp}]</span> {log.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

