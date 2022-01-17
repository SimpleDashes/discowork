import { SlashCommandIntegerOption } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
import type IDiscordOption from "../interfaces/IDiscordOption";

export default class IntegerOption
  extends SlashCommandIntegerOption
  implements IDiscordOption<number>
{
  public apply(interaction: CommandInteraction): number | null {
    return interaction.options.getInteger(this.name, this.required);
  }
}
