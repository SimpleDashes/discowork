import BaseMetadataFactory from "./BaseMetadataFactory";

export default class ClassMetadataFactory<M> extends BaseMetadataFactory<M> {
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
