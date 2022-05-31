export class TypedReflect {
  public static defineProperty<T extends object>(
    target: T,
    propertyKey: keyof T,
    attributes: PropertyDescriptor
  ): boolean {
    return Reflect.defineProperty(target, propertyKey, attributes);
  }

  public static deleteProperty<T extends object>(
    target: T,
    propertyKey: keyof T
  ): boolean {
    return Reflect.deleteProperty(target, propertyKey);
  }

  public static ownKeys<T extends object>(target: T): (string | symbol)[] {
    return Reflect.ownKeys(target);
  }

  public static apply<O, A, R, T extends (...args: A[]) => R>(
    target: T,
    thisArgument: O,
    argumentsList: ArrayLike<A>
  ): R {
    return Reflect.apply(target, thisArgument, argumentsList);
  }

  public static construct<A, R, T extends (...args: A[]) => R>(
    target: T,
    argumentsList: ArrayLike<A>,
    newTarget?: T | undefined
  ): R {
    return Reflect.construct(target, argumentsList, newTarget);
  }

  public static get<T extends object>(
    target: T,
    propertyKey: keyof T,
    receiver?: T
  ): unknown {
    return Reflect.get(target, propertyKey, receiver);
  }

  public static getOwnPropertyDescriptor<T extends object>(
    target: T,
    propertyKey: keyof T
  ): PropertyDescriptor | undefined {
    return Reflect.getOwnPropertyDescriptor(target, propertyKey);
  }

  public static getPrototypeOf<T extends object>(target: T): T | null {
    return Reflect.getPrototypeOf(target) as T;
  }

  public static has<T extends object>(
    target: T,
    propertyKey: keyof T
  ): boolean {
    return Reflect.has(target, propertyKey);
  }

  public static isExtensible<T extends object>(target: T): boolean {
    return Reflect.isExtensible(target);
  }

  public static preventExtensions<T extends object>(target: T): boolean {
    return Reflect.preventExtensions(target);
  }

  public static set<T extends object>(
    target: T,
    propertyKey: keyof T,
    value: unknown,
    receiver?: unknown
  ): boolean {
    return Reflect.set(target, propertyKey, value, receiver);
  }

  public static setPrototypeOf<T extends object>(
    target: T,
    proto: T | null
  ): boolean {
    return Reflect.setPrototypeOf(target, proto);
  }
}
