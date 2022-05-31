import type { CacheType, CommandInteraction } from "discord.js";
import type { TypedArguments, WithTypedArguments } from "../../contexts";
import type { BaseJunaContext } from "../../contexts/InteractionContext";

export type CommandContext<A> = BaseJunaContext<CommandInteraction> &
  WithTypedArguments<A>;

export abstract class BaseCommandContext<A> implements CommandContext<A> {
  public interaction: CommandInteraction<CacheType>;
  public arguments!: TypedArguments<A>;

  public constructor(interaction: CommandInteraction) {
    this.interaction = interaction;
  }

  public abstract build(): Promise<void>;
}

export class DefaultCommandContext extends BaseCommandContext<never> {
  public async build(): Promise<void> {
    /**
     * Ignores.
     */
  }
}
