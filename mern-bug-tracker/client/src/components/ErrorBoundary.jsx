import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary Details:', {
      error: error,
      errorInfo: errorInfo,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name
    });

    // Store error details in state
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Simulate logging to an error reporting service
    console.group('🐛 Error Logged to Service');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Props:', this.props);
    console.error('State:', this.state);
    console.groupEnd();
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>🐛 Something went wrong!</h2>
            <p className="error-message">
              We're sorry, but something unexpected happened.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <div className="error-info">
                  <h3>Error:</h3>
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  
                  <h3>Component Stack:</h3>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                  
                  <h3>Stack Trace:</h3>
                  <pre>{this.state.error && this.state.error.stack}</pre>
                </div>
              </details>
            )}
            
            <div className="error-actions">
              <button onClick={this.handleRetry} className="retry-button">
                Try Again
              </button>
              <button onClick={() => window.location.reload()} className="reload-button">
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
