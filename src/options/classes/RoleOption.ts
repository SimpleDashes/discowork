import { SlashCommandRoleOption } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
import { Role } from "discord.js";
import type { IDiscordOption } from "../interfaces/IDiscordOption";

export class RoleOption
  extends SlashCommandRoleOption
  implements IDiscordOption<Role>
{
  public apply(interaction: CommandInteraction): Role | null {
    const role = interaction.options.getRole(this.name, this.required);
    return role instanceof Role ? role : null;
  }
}
