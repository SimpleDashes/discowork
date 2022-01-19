import Command from "../../../commands/Command";
import { CommandInformation } from "../../../commands/decorators";
import type { CommandContextOnlyInteractionAndClient } from "../../../commands/interfaces/CommandContext";
import type CommandContext from "../../../commands/interfaces/CommandContext";
import BooleanOption from "../../../options/classes/BooleanOption";
import { Preconditions, CommandPreconditions } from "../../../preconditions";
import type { ConstructorType } from "../../../types";

type Args = {
  yum: BooleanOption;
};

@CommandPreconditions(Preconditions.GuildOnly)
@CommandInformation({
  name: "owo",
  description: "uwu...",
})
export default class OwO extends Command<Args, CommandContext<Args>> {
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
