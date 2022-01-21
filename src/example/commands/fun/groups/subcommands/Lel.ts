import { CommandContext, SubCommand } from "../../../../../commands";
import CommandInformation from "../../../../../commands/decorators/CommandInformation";
import { CommandContextOnlyInteractionAndClient } from "../../../../../commands/interfaces/CommandContext";
import { ConstructorType } from "../../../../../types";

@CommandInformation({
  name: "lel",
  description: "lul",
})
export default class Lel extends SubCommand<unknown, CommandContext<unknown>> {
  public async trigger(context: CommandContext<unknown>): Promise<void> {
    await context.interaction.reply("lel");
  }

  public contextConstructor():
    | ConstructorType<
        [CommandContextOnlyInteractionAndClient],
        CommandContext<unknown>
      >
    | undefined {
    return undefined;
  }

  public createArguments(): unknown {
    return {};
  }
}
