import type { Snowflake } from "discord.js";
import { Collection, SnowflakeUtil } from "discord.js";

export default class MetadataFactory<M> {
  readonly #id = SnowflakeUtil.generate();
  readonly #ids: Collection<unknown, Snowflake> = new Collection();

  public getMetadataName<T>(target: T, name: keyof T): string {
    const id = this.#ids.get(target) ?? SnowflakeUtil.generate();
    const metadataName = `${this.#id}_${name}_${id}`;
    this.#ids.set(target, id);
    return metadataName;
  }

  public getMetadataFromTarget<T>(target: T, name: keyof T): M | undefined {
    return Reflect.getMetadata(this.getMetadataName(target, name), target);
  }

  public setMetadataFromTarget<T>(target: T, name: keyof T, metadata: M): void {
    Reflect.defineMetadata(
      this.getMetadataName(target, name),
      metadata,
      target
    );
  }
}
