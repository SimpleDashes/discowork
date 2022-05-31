import { SlashCommandNumberOption } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
import type { IDiscordOption } from "../interfaces/IDiscordOption";

export class NumberOption
  extends SlashCommandNumberOption
  implements IDiscordOption<number>
{
  public apply(interaction: CommandInteraction): number | null {
    return interaction.options.getNumber(this.name, this.required);
  }
}
