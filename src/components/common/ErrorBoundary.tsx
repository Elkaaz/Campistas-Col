import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 24,
          fontFamily: 'monospace',
          background: '#0a0e1a',
          color: '#e2e8f0',
          minHeight: '100vh',
        }}>
          <h1 style={{ color: '#f87171' }}>Error en la aplicación</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#fcd34d' }}>
            {this.state.error.message}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#9ca3af', marginTop: 12 }}>
            {this.state.error.stack}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}
