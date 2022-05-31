import type { GuildMember, PermissionResolvable } from "discord.js";
import { CommandPrecondition } from "../";
import type { CommandContext } from "../../commands";

export class GuildPermissionsPrecondition extends CommandPrecondition {
  public readonly requiredPermissions: PermissionResolvable;

  public constructor(requiredPermissions: PermissionResolvable) {
    super();
    this.requiredPermissions = requiredPermissions;
  }

  protected async validateInternally(
    context: CommandContext<unknown>
  ): Promise<boolean> {
    const { interaction } = context;
    return (
      interaction.inGuild() &&
      (interaction.member as GuildMember).permissions.has(
        this.requiredPermissions
      )
    );
  }
}
