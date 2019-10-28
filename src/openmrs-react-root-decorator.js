import React from "react";
import { ModuleNameContext } from "@openmrs/esm-module-config";

export default function decorateOptions(opts) {
  if (
    typeof opts !== "object" ||
    typeof opts.featureName !== "string" ||
    typeof opts.moduleName !== "string"
  ) {
    throw new Error(
      "openmrs-react-root-decorator should be called with an opts object that has " +
        "1. a featureName string and 2. a moduleName string. " +
        "The moduleName string will be used to look up configuration. " +
        "e.g. openmrsRootDecorator({featureName: 'nice feature', moduleName: '@openmrs/esm-nice-feature' })"
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
          const rootComponent = (
            <ModuleNameContext.Provider value={opts.moduleName}>
              <React.Suspense fallback="root loading....">
                <Comp {...this.props} />
              </React.Suspense>
            </ModuleNameContext.Provider>
          );
          if (opts.strictMode || !React.StrictMode) {
            return rootComponent;
          } else {
            return <React.StrictMode>{rootComponent}</React.StrictMode>;
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
