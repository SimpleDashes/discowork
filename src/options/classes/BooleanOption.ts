import { SlashCommandBooleanOption } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
import type { IDiscordOption } from "../interfaces/IDiscordOption";

export class BooleanOption
  extends SlashCommandBooleanOption
  implements IDiscordOption<boolean>
{
  public apply(
    interaction: CommandInteraction,
    returnDefault?: boolean
  ): boolean {
    return (
      interaction.options.getBoolean(this.name, this.required) ??
      returnDefault ??
      false
    );
  }
}
