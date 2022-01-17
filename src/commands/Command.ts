import { SlashCommandBuilder } from "@discordjs/builders";
import type ConstructorType from "../types/ConstructorType";
import type CommandContext from "./types/CommandContext";
import type { CommandContextOnlyInteractionAndClient } from "./types/CommandContext";
import type SimpleCommandInterface from "./types/SimpleCommandInterface";

export default abstract class Command<A>
  extends SlashCommandBuilder
  implements SimpleCommandInterface<A>
{
  public args!: A;
  public abstract trigger(context: CommandContext<A>): Promise<void>;
  public abstract contextConstructor():
    | ConstructorType<
        [CommandContextOnlyInteractionAndClient],
        CommandContext<A>
      >
    | undefined;

  public abstract createArguments(): A;
}
