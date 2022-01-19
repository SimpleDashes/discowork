import assert from "assert";
import type { GuildMember, PermissionResolvable } from "discord.js";
import type CommandContext from "../../commands/interfaces/CommandContext";
import CommandPrecondition from "../CommandPrecondition";

export default class GuildPermissionsPrecondition extends CommandPrecondition {
  public readonly requiredPermissions: PermissionResolvable;

  public constructor(requiredPermissions: PermissionResolvable) {
    super();
    this.requiredPermissions = requiredPermissions;
  }

  protected async validateInternally(
    context: CommandContext<unknown>
  ): Promise<boolean> {
    const { interaction } = context;
    assert(interaction.inGuild());
    return (interaction.member as GuildMember).permissions.has(
      this.requiredPermissions
    );
  }
}
