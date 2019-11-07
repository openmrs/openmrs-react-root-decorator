import React from "react";
import openmrsRootDecorator from "./openmrs-react-root-decorator";
import { render, getByText } from "@testing-library/react";
import { ModuleNameContext } from "@openmrs/esm-module-config";

describe("openmrs-react-root-decorator", () => {
  const opts = {
    featureName: "Test",
    moduleName: "@openmrs/esm-test",
    throwErrorsToConsole: false
  };
  it("renders a component", () => {
    const DecoratedComp = openmrsRootDecorator(opts)(CompThatWorks);
    const { getByText } = render(<DecoratedComp />);
    expect(getByText("The button")).toBeTruthy();
  });

  it("catches any errors in the component tree and renders a ui explaining something bad happened", () => {
    const DecoratedComp = openmrsRootDecorator(opts)(CompThatThrows);
    try {
      render(<DecoratedComp />);
    } catch (err) {
      // expected
    }

    // TODO assert that a real UX is showing for catastrophic errors
  });

  it("provides ModuleNameContext", () => {
    const DecoratedComp = openmrsRootDecorator(opts)(CompWithConfig);
  });
});

function CompThatWorks() {
  return <button>The button</button>;
}

function CompThatThrows() {
  throw Error("ahahaa");
}

function CompWithConfig() {
  const moduleName = React.useContext(ModuleNameContext);
  return <div>{moduleName}</div>;
}
