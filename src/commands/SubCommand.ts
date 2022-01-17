import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import type { ConstructorType } from "../types";
import type CommandContext from "./types/CommandContext";
import type { CommandContextOnlyInteractionAndClient } from "./types/CommandContext";
import type SimpleCommandInterface from "./types/SimpleCommandInterface";

export default abstract class SubCommand<A>
  extends SlashCommandSubcommandBuilder
  implements SimpleCommandInterface<A>
{
  public args!: A;
  public abstract trigger: (context: CommandContext<A>) => Promise<void>;
  public abstract contextConstructor: () => ConstructorType<
    [CommandContextOnlyInteractionAndClient],
    CommandContext<A>
  >;
  public abstract createArguments: () => A;
}
