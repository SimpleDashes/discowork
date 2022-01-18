import { Collection } from "discord.js";

export default class MetadataFactory<M> {
  readonly #collection: Collection<string, M> = new Collection();
  readonly #ids: Collection<unknown, number> = new Collection();
  readonly #name: string;

  public constructor(name: string) {
    this.#name = name;
  }

  public getNameFor<T>(target: T, name: keyof T): string {
    const id = this.#ids.get(target) ?? (this.#ids.last() ?? 0) + 1;

    const methodName = this.#name + id + name;

    return methodName;
  }

  public setMetadata(name: string, metadata: M): void {
    this.#collection.set(name, metadata);
  }

  public getMetadata(name: string): M | undefined {
    return this.#collection.get(name);
  }

  public getMetadataFromTarget<T>(target: T, name: keyof T): M | undefined {
    return this.getMetadata(this.getNameFor(target, name));
  }

  public setMetadataFromTarget<T>(target: T, name: keyof T, metadata: M): void {
    this.setMetadata(this.getNameFor(target, name), metadata);
  }
}
