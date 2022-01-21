import EventEmitter from "node:events";

export type Event<A extends unknown[] = []> = {
  name: string;
  args: A;
};

export type NewEvent<NAME extends string, ARGS extends unknown[] = []> = {
  name: NAME;
  args: ARGS;
} & Event<ARGS>;

export default class TypedEventEmitter<
  E extends Event<unknown[]>[]
> extends EventEmitter {
  public override emit<T extends E[number]>(
    eventName: T["name"],
    ...args: T["args"]
  ): boolean {
    return super.emit(eventName, args);
  }
  public override on<T extends E[number]>(
    eventName: T["name"],
    listener: (...args: T["args"]) => void
  ): this {
    return super.on(eventName, listener as (...args: unknown[]) => void);
  }
}
