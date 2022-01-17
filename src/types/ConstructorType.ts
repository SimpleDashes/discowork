type ConstructorType<A extends unknown[], T> = {
  new (...args: A): T;
};

export default ConstructorType;
