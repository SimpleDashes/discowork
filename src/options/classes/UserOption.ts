import { SlashCommandUserOption } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import type { CommandInteraction, User } from "discord.js";
import type { IDiscordOption } from "../interfaces/IDiscordOption";
import assert from "assert";

export class UserOption
  extends SlashCommandUserOption
  implements IDiscordOption<User>
{
  public readonly defaultToSelf: boolean;

  public constructor(defaultToSelf = false) {
    super();
    this.defaultToSelf = defaultToSelf;
  }

  public apply(interaction: CommandInteraction): User | null {
    return interaction.options.getUser(this.name, this.required) ??
      this.defaultToSelf
      ? interaction.user
      : null;
  }

  public applyAsMember(interaction: CommandInteraction): GuildMember | null {
    if (!interaction.inGuild()) {
      throw "Can't apply for member with userOption (Interaction not made in a guild)";
    }

    const member =
      interaction.options.getMember(this.name, this.required) ??
      this.defaultToSelf
        ? interaction.member
        : null;

    assert(member instanceof GuildMember);

    return member;
  }
}
