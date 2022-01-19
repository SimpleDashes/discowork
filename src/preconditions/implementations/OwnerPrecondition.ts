import type { Snowflake } from "discord.js";
import type CommandContext from "../../commands/interfaces/CommandContext";
import CommandPrecondition from "../CommandPrecondition";

export default class OwnerPrecondition extends CommandPrecondition {
  public ownerIDS: Snowflake[];

  public constructor(ownerIDS: Snowflake[]) {
    super();
    this.ownerIDS = ownerIDS;
  }

  protected async validateInternally(
    context: CommandContext<unknown>
  ): Promise<boolean> {
    return this.ownerIDS.includes(context.interaction.user.id);
  }
}
