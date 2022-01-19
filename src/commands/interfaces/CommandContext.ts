import type { CommandInteraction } from "discord.js";
import type DiscordContext from "../../contexts/DiscordContext";

export default interface CommandContext<A> extends DiscordContext<A> {
  readonly interaction: CommandInteraction;
}

type CommandContextOnlyInteractionAndClient = Pick<
  CommandContext<unknown>,
  "interaction" | "client"
>;

export type { CommandContextOnlyInteractionAndClient };
