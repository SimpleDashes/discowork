import type { Awaitable } from "discord.js";
import { EventEmitter } from "stream";
import { AsyncEventEmitter } from "./AsyncEventEmitter";

export type Event<A extends unknown[] = []> = {
  name: string;
  args: A;
};

export type NewEvent<NAME extends string, ARGS extends unknown[] = []> = {
  name: NAME;
  args: ARGS;
} & Event<ARGS>;

export class AsyncTypedEventEmitter<
  E extends Event<unknown[]>[]
> extends AsyncEventEmitter {
  public override emit<T extends E[number]>(
    eventName: T["name"],
    ...args: T["args"]
  ): boolean {
    return super.emit(eventName, args);
  }
  public override on<T extends E[number]>(
    eventName: T["name"],
    listener: (...args: T["args"]) => Awaitable<void>
  ): this {
    return super.on(eventName, listener);
  }
  public override emitAsync<T extends E[number]>(
    eventName: T["name"],
    ...args: T["args"]
  ): Promise<boolean> {
    return super.emitAsync(eventName, args);
  }
}

export class SynchronousTypedEventEmitter<
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
    return super.on(eventName, listener);
  }
}
