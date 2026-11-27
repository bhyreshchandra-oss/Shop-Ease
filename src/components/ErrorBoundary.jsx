import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Unexpected error",
    };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <p style={{ margin: "10px 0 20px", opacity: 0.8 }}>
            {this.state.errorMessage}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#18466e",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
