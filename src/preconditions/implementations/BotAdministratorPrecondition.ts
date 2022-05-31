import type { Snowflake } from "discord.js";
import type { BaseCommandContext } from "../../commands/interfaces/CommandContext";
import { CommandPrecondition } from "../CommandPrecondition";

export class BotAdministratorPrecondition extends CommandPrecondition {
  public botAdministrators: Snowflake[];

  public constructor(ownerIDS: Snowflake[]) {
    super();
    this.botAdministrators = ownerIDS;
  }

  protected async validateInternally(
    context: BaseCommandContext<unknown>
  ): Promise<boolean> {
    return this.botAdministrators.includes(context.interaction.user.id);
  }
}
