export type ConstructorType<A extends unknown[], T> = {
  new (...args: A): T;
  prototype: T;
};
