import React from "react";
import openmrsRootDecorator from "./openmrs-react-root-decorator";
import { render, getByText } from "@testing-library/react";

describe("openmrs-react-root-decorator", () => {
  const opts = { featureName: "Test", throwErrorsToConsole: false };
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
});

function CompThatWorks() {
  return <button>The button</button>;
}

function CompThatThrows() {
  throw Error("ahahaa");
}
