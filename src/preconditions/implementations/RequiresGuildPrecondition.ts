import type CommandContext from "../../commands/interfaces/CommandContext";
import CommandPrecondition from "../CommandPrecondition";

export default class RequiresGuildPrecondition extends CommandPrecondition {
  protected async validateInternally(
    context: CommandContext<unknown>
  ): Promise<boolean> {
    return context.interaction.inGuild();
  }
}
