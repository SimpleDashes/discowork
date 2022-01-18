import "reflect-metadata";
import MetadataFactory from "./MetadataFactory";

export class MethodDecoratorFactories {
  public static readonly RunOnce: MetadataFactory<{ ran: true }> =
    new MetadataFactory();
}

abstract class MethodDecorator {
  public static decorateMethod<T extends object>(
    target: T,
    name: keyof T
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    const recordTarget = target as Record<keyof T, unknown>;
    const original = recordTarget[name] as (...args: unknown[]) => unknown;

    recordTarget[name] = function (...args: unknown[]): unknown {
      that.internalDecorate(target, name);
      return original.apply(this, args);
    };
  }

  public static decorateTarget<T extends object>(
    target: T,
    name: keyof T,
    propertyDescriptor: PropertyDescriptor
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    const original = propertyDescriptor.value as (
      ...args: unknown[]
    ) => unknown;

    propertyDescriptor.value = function (...args: unknown[]): unknown {
      that.internalDecorate(target, name);
      return original.apply(this, args);
    };
  }

  public static internalDecorate<T extends object>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _target: T,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _name: keyof T
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ): void {
    throw "Must implement.";
  }
}

export class RunOnceWrapper extends MethodDecorator {
  public static internalDecorate<T extends object>(
    target: T,
    name: keyof T
  ): void {
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
  }
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
    RunOnceWrapper.decorateTarget(target, name, descriptor);
  };
};
