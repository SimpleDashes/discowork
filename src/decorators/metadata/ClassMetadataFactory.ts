import type { ConstructorType } from "../../types";
import BaseMetadataFactory from "./BaseMetadataFactory";

export default class ClassMetadataFactory<M> extends BaseMetadataFactory<M> {
  static #NAME = "KLASS_METADATA";

  public override getMetadataName<
    T extends ConstructorType<[...unknown[]], unknown>
  >(target: T): string {
    return super.getMetadataName(target, ClassMetadataFactory.#NAME);
  }

  public override getMetadataFromTarget<
    T extends ConstructorType<[...unknown[]], unknown>
  >(target: T): M | undefined {
    return super.getMetadataFromTarget(target, ClassMetadataFactory.#NAME);
  }

  public override setMetadataFromTarget<
    T extends ConstructorType<[...unknown[]], unknown>
  >(metadata: M, target: T): void {
    super.setMetadataFromTarget(metadata, target, ClassMetadataFactory.#NAME);
  }
}
