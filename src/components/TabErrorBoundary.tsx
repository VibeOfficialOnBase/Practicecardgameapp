import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  tabName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component for individual tab sections
 * Catches errors in child components and displays a user-friendly fallback
 */
export class TabErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Tab Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback or default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="glass-card p-8 rounded-2xl max-w-md">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {this.props.tabName ? `${this.props.tabName} Error` : 'Something went wrong'}
            </h2>
            <p className="text-white/80 mb-6 leading-relaxed">
              We encountered an error while loading this section. Don't worry, your progress is safe.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-300 text-sm font-mono break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
