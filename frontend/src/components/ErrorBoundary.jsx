import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // Custom error UI
            return (
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[500px] sm:h-[600px]">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-red-800 mb-2">
                                Something went wrong
                            </h3>
                            <p className="text-red-700 mb-4">
                                {this.props.fallbackMessage || 'An error occurred while loading this component.'}
                            </p>
                            <button
                                onClick={() => {
                                    this.setState({ hasError: false, error: null, errorInfo: null });
                                    if (this.props.onRetry) {
                                        this.props.onRetry();
                                    } else {
                                        window.location.reload();
                                    }
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </button>
                            {process.env.NODE_ENV === 'development' && (
                                <details className="mt-4 text-left">
                                    <summary className="cursor-pointer text-red-600 font-medium">
                                        Error Details (Development Only)
                                    </summary>
                                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded text-red-800 overflow-auto">
                                        {this.state.error && this.state.error.toString()}
                                        <br />
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;