import { SlashCommandBuilder } from "@discordjs/builders";
import type { CacheType, CommandInteraction } from "discord.js";
import type { ConstructorType } from "../../types/ConstructorType";
import type { CommandContext } from "../interfaces";
import type { WorkerCommand } from "../interfaces/WorkerCommand";

export abstract class JunaCommand<A, CTX extends CommandContext<A>>
  extends SlashCommandBuilder
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

const JunaInactiveCommandError =
  "Inactive command method ran. (Unexpected Behaviour)";

export class JunaInactiveCommand extends JunaCommand<unknown, never> {
  public trigger(): Promise<void> {
    throw new Error(JunaInactiveCommandError);
  }

  public getContextConstructor(): ConstructorType<
    [CommandInteraction<CacheType>],
    never
  > {
    throw new Error(JunaInactiveCommandError);
  }

  public createArguments(): unknown {
    throw new Error(JunaInactiveCommandError);
  }
}
