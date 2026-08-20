import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // log to console for now
    console.error('Captured error in ErrorBoundary', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Bir xəta baş verdi</h2>
          <p>Proqram işləməsinə davam etmək üçün səhifəni yeniləyin.</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</details>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
