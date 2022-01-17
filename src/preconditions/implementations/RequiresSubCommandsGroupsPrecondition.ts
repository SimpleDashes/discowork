import type CommandContext from "../../commands/types/CommandContext";
import CommandPrecondition from "../CommandPrecondition";

export default class RequiresSubCommandsGroupsPrecondition extends CommandPrecondition {
  protected async validateInternally(
    context: CommandContext<unknown>
  ): Promise<boolean> {
    return !!context.interaction.options.getSubcommandGroup(false);
  }
}
