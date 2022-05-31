import type { BaseCommandContext } from "../../commands/interfaces/CommandContext";
import { CommandPrecondition } from "../CommandPrecondition";

export class RequiresSubCommandsPrecondition extends CommandPrecondition {
  protected async validateInternally(
    context: BaseCommandContext<unknown>
  ): Promise<boolean> {
    return !!context.interaction.options.getSubcommand(false);
  }
}
