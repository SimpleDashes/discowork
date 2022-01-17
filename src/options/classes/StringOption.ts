import { SlashCommandStringOption } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
import type IDiscordOption from "../interfaces/IDiscordOption";

export default class StringOption
  extends SlashCommandStringOption
  implements IDiscordOption<string>
{
  public apply(interaction: CommandInteraction): string | null {
    return interaction.options.getString(this.name, this.required);
  }
}
