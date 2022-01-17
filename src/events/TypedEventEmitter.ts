import EventEmitter from "node:events";

export default class TypedEventEmitter<
  T extends string,
  A = []
> extends EventEmitter {
  public override emit(eventName: T, ...args: A[]): boolean {
    return super.emit(eventName, args);
  }
  public override on(eventName: T, listener: (...args: A[]) => void): this {
    return super.on(eventName, listener);
  }
}
