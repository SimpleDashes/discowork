import TypedReflect from "./TypedReflect";

type GetterSetter<T> = {
  get: () => T;
  set: (v: T) => void;
};
/**
 * Creates a read/writable property which returns a function set for write/set (assignment)
 * and read/get access on a variable
 */
export function createProperty(value: unknown): GetterSetter<unknown> {
  let _value = value;

  /**
   * Overwrite getter.
   *
   * @returns {Any} The Value.
   * @private
   */
  function _get(): unknown {
    return _value;
  }

  /**
   * Overwrite setter.
   * @param v Sets the value.
   * @private
   */
  function _set(v: unknown): void {
    _value = v;
  }

  return {
    get: _get,
    set: _set,
  };
}

/**
 * Creates or replaces a read-write-property in a given scope object, especially for non-writable properties.
 * This also works for built-in host objects (non-DOM objects), e.g. navigator.
 * Optional an initial value can be passed, otherwise the current value of the object-property will be set.
 *
 * @param object  e.g. window
 * @param objScopeName    e.g. "navigator"
 * @param name    e.g. "userAgent"
 * @param value (optional)   e.g. window.navigator.userAgent
 */
export function makePropertyWritable<T, K extends keyof T & string, V>(
  object: T & Record<keyof T, unknown>,
  name: K,
  value?: V extends undefined ? never : V
): void {
  const newProperty = createProperty(value);

  const retry = (): void => {
    const initializerObject = {} as Record<keyof T, unknown>;
    initializerObject[name] = newProperty;
  };

  try {
    TypedReflect.defineProperty(object, name, newProperty);
    if (TypedReflect.getOwnPropertyDescriptor(object, name)) {
      retry();
    }
  } catch (e) {
    retry();
  }
}
