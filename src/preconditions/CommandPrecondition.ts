import type {
  BaseCommandContext,
  CommandContext,
} from "../commands/interfaces/CommandContext";
import { InteractionUtils } from "../utils/InteractionUtils";

export abstract class CommandPrecondition {
  public onFailMessage?: (context: CommandContext<unknown>) => string;

  public async validate(
    context: BaseCommandContext<unknown>
  ): Promise<boolean> {
    const { interaction } = context;

    const validated = await this.validateInternally(context);

    if (!validated && this.onFailMessage) {
      await InteractionUtils.reply(interaction, this.onFailMessage(context));
    }

    return validated;
  }

  protected abstract validateInternally(
    context: BaseCommandContext<unknown>
  ): Promise<boolean>;
}
