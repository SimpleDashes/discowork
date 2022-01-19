import type { ObjectKeyString } from "./BaseMetadataFactory";
import BaseMetadataFactory from "./BaseMetadataFactory";

export default class MethodMetadataFactory<M> extends BaseMetadataFactory<M> {
  public override getMetadataName<T extends object>(
    target: T,
    name: ObjectKeyString<T>
  ): string {
    return super.getMetadataName(target, name);
  }

  public override getMetadataFromTarget<T extends object>(
    target: T,
    name: ObjectKeyString<T>
  ): M | undefined {
    return super.getMetadataFromTarget(target, name);
  }

  public override setMetadataFromTarget<T extends object>(
    metadata: M,
    target: T,
    name: ObjectKeyString<T>
  ): void {
    super.setMetadataFromTarget(metadata, target, name);
  }
}
