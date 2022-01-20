import { CommandContextOnlyInteractionAndClient } from "../../../commands";
import Command from "../../../commands/classes/Command";
import CommandInformation from "../../../commands/decorators/CommandInformation";
import CommandContext from "../../../commands/interfaces/CommandContext";
import BooleanOption from "../../../options/classes/BooleanOption";
import { CommandPreconditions, Preconditions } from "../../../preconditions";
import ConstructorType from "../../../types/ConstructorType";


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
