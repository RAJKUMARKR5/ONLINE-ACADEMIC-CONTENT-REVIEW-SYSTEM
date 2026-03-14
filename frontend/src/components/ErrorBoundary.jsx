import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded text-center">
                    Google Sign-In is currently unavailable. Please check your network connection or try standard login.
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
