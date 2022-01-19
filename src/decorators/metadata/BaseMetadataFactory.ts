import type { Snowflake } from "discord-api-types";
import { SnowflakeUtil, Collection } from "discord.js";

export type ObjectKeyString<T> = keyof T & string;

export default abstract class MetadataFactory<M> {
  protected readonly id = SnowflakeUtil.generate();
  protected readonly ids = new Collection<unknown, Snowflake>();

  public getMetadataName(target: object, name: string): string {
    const id = this.ids.get(target) ?? SnowflakeUtil.generate();
    const metadataName = [this.id, id, name].map((a) => a + "_").toString();
    this.ids.set(target, id);
    return metadataName;
  }

  public getMetadataFromTarget(target: object, name: string): M | undefined {
    return Reflect.getMetadata(this.getMetadataName(target, name), target);
  }

  public setMetadataFromTarget(
    metadata: M,
    target: object,
    name: string
  ): void {
    Reflect.defineMetadata(
      this.getMetadataName(target, name),
      metadata,
      target
    );
  }
}
