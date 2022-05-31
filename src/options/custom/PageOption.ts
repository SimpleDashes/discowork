import type { CommandInteraction } from "discord.js";
import { MathUtils } from "../../utils";

import { IntegerOption } from "../classes/IntegerOption";
import type { ILazyApply } from "../interfaces/ILazyApply";

export class PageOption extends IntegerOption implements ILazyApply {
  public readonly lazyApply: true = true;
  public readonly itemsPerPage: number;

  public constructor(itemsPerPage: number) {
    super();
    this.itemsPerPage = itemsPerPage;
  }

  public override apply<T>(interaction: CommandInteraction, res?: T[]): number {
    if (!res) {
      throw "PageOption apply: res argument shall be passed.";
    }

    return MathUtils.clamp(
      super.apply(interaction) ?? 1,
      1,
      Math.ceil(res.length / this.itemsPerPage)
    );
  }
}
