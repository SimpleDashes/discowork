import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import type { ConstructorType } from "../types";
import type CommandContext from "./interfaces/CommandContext";
import type { CommandContextOnlyInteractionAndClient } from "./interfaces/CommandContext";
import type WorkerCommand from "./interfaces/WorkerCommand";

export default abstract class SubCommand<A, CTX extends CommandContext<A>>
  extends SlashCommandSubcommandBuilder
  implements WorkerCommand<A, CTX>
{
  public args!: A;
  public abstract trigger(context: CTX): Promise<void>;
  public abstract contextConstructor(): ConstructorType<
    [CommandContextOnlyInteractionAndClient],
    CTX
  >;
  public abstract createArguments(): A;
}
