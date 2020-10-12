import { ComponentType } from "react";

export interface DecorateOptions {
  featureName: string;
  moduleName: string;
  strictMode?: boolean;
  throwErrorsToConsole?: boolean;
  disableTranslations?: boolean;
}

export interface Decorator {
  <TProps>(Component: ComponentType<TProps>): ComponentType<TProps>;
}

export default function decorateOptions(userOpts: DecorateOptions): Decorator;
