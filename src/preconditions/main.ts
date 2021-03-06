import type { PermissionResolvable } from "discord.js";
import type CommandPrecondition from "./CommandPrecondition";
import GuildPermissionsPreconditions from "./implementations/GuildPermissionsPreconditions";
import type CommandWithPreconditions from "./interfaces/CommandWithPreconditions";
import type OwnerPrecondition from "./implementations/OwnerPrecondition";
import RequiresGuildPrecondition from "./implementations/RequiresGuildPrecondition";
import RequiresSubCommandsPrecondition from "./implementations/RequiresSubCommandsPrecondition";
import RequiresSubCommandsGroupsPrecondition from "./implementations/RequiresSubCommandsGroupsPrecondition";
import type CommandInterface from "../commands/interfaces/CommandInterface";
import ConstructorType from "../types/ConstructorType";

export class PreconditionUtils {
  public static commandContainsPreconditions(
    command: unknown
  ): command is CommandWithPreconditions {
    return (
      (command as unknown as CommandWithPreconditions).preconditions !==
      undefined
    );
  }
}

export class SetupPrecondition {
  public static setup(owner: OwnerPrecondition): void {
    this.setupOwnerPrecondition(owner);
    this.setupGuildPrecondition();
    this.setupSubCommandPrecondition();
    this.setupSubCommandGroupsPrecondition();
    this.setupGuildPermissionsPrecondition();
  }

  public static setupOwnerPrecondition(condition: OwnerPrecondition): void {
    Preconditions.OwnerOnly = condition;
  }

  public static setupGuildPrecondition(
    condition = new RequiresGuildPrecondition()
  ): void {
    Preconditions.GuildOnly = condition;
  }

  public static setupSubCommandPrecondition(
    condition = new RequiresSubCommandsPrecondition()
  ): void {
    Preconditions.RequiresSubCommand = condition;
  }

  public static setupSubCommandGroupsPrecondition(
    condition = new RequiresSubCommandsGroupsPrecondition()
  ): void {
    Preconditions.RequiresSubCommandGroup = condition;
  }

  public static setupGuildPermissionsPrecondition(
    creator = (
      permissions: PermissionResolvable
    ): GuildPermissionsPreconditions =>
      new GuildPermissionsPreconditions(permissions)
  ): void {
    Preconditions.WithPermission = creator;
  }
}

export class Preconditions {
  public static OwnerOnly: OwnerPrecondition;
  public static GuildOnly: RequiresGuildPrecondition;
  public static RequiresSubCommand: RequiresSubCommandsPrecondition;
  public static RequiresSubCommandGroup: RequiresSubCommandsGroupsPrecondition;
  public static WithPermission = (
    permissions: PermissionResolvable
  ): GuildPermissionsPreconditions => {
    return new GuildPermissionsPreconditions(permissions);
  };
}

function CommandPreconditions(...preconditions: CommandPrecondition[]) {
  return (target: ConstructorType<[...unknown[]], CommandInterface>): void => {
    const prototype = target.prototype as unknown as CommandWithPreconditions;
    prototype.preconditions ??= [];

    const maybeGuildPrecondition = preconditions.find(
      (c) => c instanceof RequiresGuildPrecondition
    );

    const guildPrecondition = maybeGuildPrecondition ?? Preconditions.GuildOnly;

    if (
      preconditions.find((c) => c instanceof GuildPermissionsPreconditions) &&
      !preconditions.includes(guildPrecondition)
    ) {
      preconditions.push(guildPrecondition);
    }

    if (preconditions.find((c) => c instanceof RequiresGuildPrecondition)) {
      preconditions = [
        guildPrecondition,
        ...preconditions.filter(
          (c) => !(c instanceof RequiresGuildPrecondition)
        ),
      ];
    }

    prototype.preconditions = [...prototype.preconditions, ...preconditions];
  };
}

export { CommandPreconditions };
