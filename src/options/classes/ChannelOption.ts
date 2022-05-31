import { SlashCommandChannelOption } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
import { GuildChannel, ThreadChannel } from "discord.js";

import type { IDiscordOption } from "../interfaces/IDiscordOption";

export class ChannelOption
  extends SlashCommandChannelOption
  implements IDiscordOption<GuildChannel | ThreadChannel>
{
  public apply(
    interaction: CommandInteraction
  ): GuildChannel | ThreadChannel | null {
    const channel = interaction.options.getChannel(this.name, this.required);
    return channel instanceof GuildChannel || channel instanceof ThreadChannel
      ? channel
      : null;
  }
}
