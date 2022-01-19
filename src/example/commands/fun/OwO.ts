import Command from "../../../commands/Command";
import { CommandInformation } from "../../../commands/decorators";
import type { CommandContextOnlyInteractionAndClient } from "../../../commands/types/CommandContext";
import type CommandContext from "../../../commands/types/CommandContext";
import BooleanOption from "../../../options/classes/BooleanOption";
import { Preconditions, CommandPreconditions } from "../../../preconditions";
import type { ConstructorType } from "../../../types";

type Args = {
  yum: BooleanOption;
};

@CommandInformation({
  name: "owo",
  description: "uwu...",
})
@CommandPreconditions(Preconditions.GuildOnly)
export default class OwO extends Command<Args> {
  public createArguments(): Args {
    return {
      yum: new BooleanOption().setName("yum").setDescription("hmm..."),
    };
  }

  public async trigger(context: CommandContext<Args>): Promise<void> {
    const { interaction, args } = context;

    let text = "UwU... ";
    if (args.yum) {
      text += "yummy...";
    }

    await interaction.reply(text);
  }

  public contextConstructor():
    | ConstructorType<
        [CommandContextOnlyInteractionAndClient],
        CommandContext<Args>
      >
    | undefined {
    return undefined;
  }
}
