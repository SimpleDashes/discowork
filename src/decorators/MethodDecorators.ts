/**
 * A decorator that ensures that a class method can only be run once.
 */
export const RunOnce = () => {
  return (
    _target: unknown,
    name: string,
    descriptor: PropertyDescriptor
  ): void => {
    type RunOnceDescriptor = PropertyDescriptor & {
      ran: boolean;
    };
    const asRunOnceDescriptor = descriptor as RunOnceDescriptor;
    if (asRunOnceDescriptor.ran) {
      throw `The method: ${name} should only be called once.`;
    }
    asRunOnceDescriptor.ran = true;
  };
};
