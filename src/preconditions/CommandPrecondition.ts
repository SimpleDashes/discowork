import type CommandContext from "../commands/types/CommandContext";
import InteractionUtils from "../utils/InteractionUtils";

export default abstract class CommandPrecondition {
  public onFailMessage?: (context: CommandContext<unknown>) => string;

  public async validate(context: CommandContext<unknown>): Promise<boolean> {
    const { interaction } = context;

    const validated = await this.validateInternally(context);

    if (!validated && this.onFailMessage) {
      await InteractionUtils.reply(interaction, this.onFailMessage(context));
    }

    return validated;
  }

  protected abstract validateInternally(
    context: CommandContext<unknown>
  ): Promise<boolean>;
}
