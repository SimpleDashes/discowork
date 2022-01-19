import type CommandContext from "../../commands/interfaces/CommandContext";
import CommandPrecondition from "../CommandPrecondition";

export default class RequiresSubCommandsPrecondition extends CommandPrecondition {
  protected async validateInternally(
    context: CommandContext<unknown>
  ): Promise<boolean> {
    return !!context.interaction.options.getSubcommand(false);
  }
}
