import { EventEmitter } from "stream";

export class AsyncEventEmitter extends EventEmitter {
  /**
   * Callbacks all listeners but awaiting for their tasks to be completed.
   * @param eventName The event name.
   * @param args The arguments to be passed for the listeners.
   * @returns Wether the event has listeners.
   */
  public async emitAsync(
    eventName: string,
    ...args: unknown[]
  ): Promise<boolean> {
    const eventListener = this.listeners(eventName);
    if (eventListener.length === 0) return false;
    for (const listener of eventListener) {
      await listener(args);
    }
    return true;
  }
}
