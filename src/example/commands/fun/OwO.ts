import Command from "../../../commands/classes/Command";
import CommandInformation from "../../../commands/decorators/CommandInformation";
import CommandContext, {
  CommandContextOnlyInteractionAndClient,
} from "../../../commands/interfaces/CommandContext";
import { CommandPreconditions, Preconditions } from "../../../preconditions";
import ConstructorType from "../../../types/ConstructorType";

@CommandPreconditions(Preconditions.RequiresSubCommandGroup)
@CommandInformation({
  name: "owo",
  description: "uwu...",
})
export default class OwO extends Command<unknown, CommandContext<unknown>> {
  public createArguments(): unknown {
    return {};
  }

  public async trigger(): Promise<void> {
    throw "Method not implemented.";
  }

  public contextConstructor():
    | ConstructorType<
        [CommandContextOnlyInteractionAndClient],
        CommandContext<unknown>
      >
    | undefined {
    return undefined;
  }
}
