import { MetadataFactory } from "./BaseMetadataFactory";

export class ClassMetadataFactory<M> extends MetadataFactory<M> {
  static #NAME = "KLASS_METADATA";

  public override getMetadataName<T extends object>(target: T): string {
    return super.getMetadataName(target, ClassMetadataFactory.#NAME);
  }

  public override getMetadataFromTarget<T extends object>(
    target: T
  ): M | undefined {
    return super.getMetadataFromTarget(target, ClassMetadataFactory.#NAME);
  }

  public override setMetadataFromTarget<T extends object>(
    metadata: M,
    target: T
  ): void {
    super.setMetadataFromTarget(metadata, target, ClassMetadataFactory.#NAME);
  }
}
