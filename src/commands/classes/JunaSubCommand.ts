import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
import type { ConstructorType } from "../../types/ConstructorType";
import type { CommandContext } from "../interfaces";
import type { WorkerCommand } from "../interfaces/WorkerCommand";

export abstract class JunaSubCommand<A, CTX extends CommandContext<A>>
  extends SlashCommandSubcommandBuilder
  implements WorkerCommand<A, CTX>
{
  public arguments!: A;

  public abstract trigger(context: CTX): Promise<void>;

  public abstract getContextConstructor(): ConstructorType<
    [CommandInteraction],
    CTX
  >;

  public abstract createArguments(): A;
}
