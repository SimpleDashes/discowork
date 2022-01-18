/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { assertDefined } from "../assertions";
import MetadataFactory from "./MetadataFactory";

export class MethodDecoratorFactories {
  public static readonly RunOnce: MetadataFactory<{ ran: boolean }> =
    new MetadataFactory("run_once_decorator_");
}

/**
 * A decorator that ensures that a class method can only be run once.
 */
export const RunOnce = () => {
  return <T extends object>(
    target: T,
    name: keyof T,
    descriptor: PropertyDescriptor
  ): void => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]): unknown {
      assertDefined(MethodDecoratorFactories.RunOnce);

      const metadataName = MethodDecoratorFactories.RunOnce.getNameFor(
        target,
        name
      );

      let metadata = MethodDecoratorFactories.RunOnce.getMetadata(metadataName);

      if (metadata?.ran) {
        throw `The method: ${name} on class ${target.constructor.name} should only be called once.`;
      }

      metadata = {
        ran: true,
      };

      MethodDecoratorFactories.RunOnce.setMetadata(metadataName, metadata);

      return originalMethod.apply(this, ...args);
    };
  };
};
