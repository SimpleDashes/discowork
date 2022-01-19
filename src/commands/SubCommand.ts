import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import type { ConstructorType } from "../types";
import type CommandContext from "./interfaces/CommandContext";
import type { CommandContextOnlyInteractionAndClient } from "./interfaces/CommandContext";
import type WorkerCommand from "./interfaces/WorkerCommand";

export default abstract class SubCommand<A>
  extends SlashCommandSubcommandBuilder
  implements WorkerCommand<A>
{
  public args!: A;
  public abstract trigger(context: CommandContext<A>): Promise<void>;
  public abstract contextConstructor(): ConstructorType<
    [CommandContextOnlyInteractionAndClient],
    CommandContext<A>
  >;
  public abstract createArguments(): A;
}
