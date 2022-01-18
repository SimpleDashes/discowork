import "reflect-metadata";

import MetadataFactory from "./MetadataFactory";

export class MethodDecoratorFactories {
  public static readonly RunOnce: MetadataFactory<{ ran: true }> =
    new MetadataFactory();
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
      let metadata = MethodDecoratorFactories.RunOnce.getMetadataFromTarget(
        target,
        name
      );

      if (metadata?.ran) {
        throw `The method: ${name} on class ${target.constructor.name} should only be called once.`;
      }

      metadata = {
        ran: true,
      };

      MethodDecoratorFactories.RunOnce.setMetadataFromTarget(
        target,
        name,
        metadata
      );

      return originalMethod.apply(this, ...args);
    };
  };
};
