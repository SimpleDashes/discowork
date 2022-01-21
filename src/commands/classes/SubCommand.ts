import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import ConstructorType from "../../types/ConstructorType";
import { CommandContextOnlyInteractionAndClient } from "../interfaces/CommandContext";
import CommandContext from "../interfaces/CommandContext";
import WorkerCommand from "../interfaces/WorkerCommand";

export default abstract class SubCommand<A, CTX extends CommandContext<A>>
  extends SlashCommandSubcommandBuilder
  implements WorkerCommand<A, CTX>
{
  public args!: A;
  public abstract trigger(context: CTX): Promise<void>;
  public abstract contextConstructor():
    | ConstructorType<[CommandContextOnlyInteractionAndClient], CTX>
    | undefined;
  public abstract createArguments(): A;
}
