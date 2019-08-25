import React from "react";

export default function decorateOptions(opts) {
  if (typeof opts !== "object" || typeof opts.featureName !== "string") {
    throw new Error(
      "openmrs-react-root-decorator should be called with an opts object that has a featureName string. e.g. @ErrorBoundary({featureName: 'life'})"
    );
  }

  return function decorateComponent(Comp) {
    return class OpenmrsReactRoot extends React.Component {
      static displayName = `OpenmrsReactRoot(${opts.featureName})`;
      static defaultProps = {
        throwErrorsToConsole: true,
        strictMode: true
      };
      state = {
        caughtError: null,
        caughtErrorInfo: null
      };
      render() {
        if (this.state.caughtError) {
          // TO-DO have a UX designed for when a catastrophic error occurs
          return null;
        } else {
          if (opts.strictMode || !React.StrictMode) {
            return <Comp {...this.props} />;
          } else {
            return (
              <React.StrictMode>
                <Comp {...this.props} />
              </React.StrictMode>
            );
          }
        }
      }
      componentDidCatch(err, info) {
        if (info && info.componentStack) {
          err.extra = Object.assign(err.extra || {}, {
            componentStack: info.componentStack
          });
        }

        if (this.props.throwErrorsToConsole) {
          setTimeout(() => {
            throw err;
          });
        }

        this.setState({
          caughtError: err,
          caughtErrorInfo: info
        });
      }
    };
  };
}
