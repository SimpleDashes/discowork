import { SlashCommandBuilder } from "@discordjs/builders";
import ConstructorType from "../../types/ConstructorType";
import CommandContext, { CommandContextOnlyInteractionAndClient } from "../interfaces/CommandContext";
import WorkerCommand from "../interfaces/WorkerCommand";

export default abstract class Command<A, CTX extends CommandContext<A>>
  extends SlashCommandBuilder
  implements WorkerCommand<A, CTX>
{
  public args!: A;
  public abstract trigger(context: CTX): Promise<void>;
  public abstract contextConstructor():
    | ConstructorType<[CommandContextOnlyInteractionAndClient], CTX>
    | undefined;
  public abstract createArguments(): A;
}
