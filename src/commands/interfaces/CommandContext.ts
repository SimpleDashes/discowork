import type { CommandInteraction } from "discord.js";
import type DiscordContext from "../../contexts/DiscordContext";

export default interface CommandContext<A> extends DiscordContext<A> {
  readonly interaction: CommandInteraction;
}

type CommandContextOnlyInteractionAndClient = Omit<
  CommandContext<unknown>,
  "args" | "build"
>;

export type { CommandContextOnlyInteractionAndClient };
