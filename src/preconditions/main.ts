import type { PermissionResolvable } from "discord.js";
import type { CommandPrecondition } from "./CommandPrecondition";

import type { CommandWithPreconditions } from "./interfaces/CommandWithPreconditions";
import type { BotAdministratorPrecondition } from "./implementations/BotAdministratorPrecondition";
import { RequiresGuildPrecondition } from "./implementations/RequiresGuildPrecondition";
import { RequiresSubCommandsPrecondition } from "./implementations/RequiresSubCommandsPrecondition";
import { RequiresSubCommandsGroupsPrecondition } from "./implementations/RequiresSubCommandsGroupsPrecondition";
import type { CommandInterface } from "../commands/interfaces/CommandInterface";
import type { ConstructorType } from "../types/ConstructorType";
import { GuildPermissionsPrecondition } from "./implementations";

export class PreconditionUtils {
  public static commandContainsPreconditions(
    command: unknown
  ): command is CommandWithPreconditions {
    return Array.isArray(
      (command as unknown as CommandWithPreconditions).preconditions
    );
  }
}

export class SetupPrecondition {
  public static setup(owner: BotAdministratorPrecondition): void {
    this.setupOwnerPrecondition(owner);
    this.setupGuildPrecondition();
    this.setupSubCommandPrecondition();
    this.setupSubCommandGroupsPrecondition();
    this.setupGuildPermissionsPrecondition();
  }

  public static setupOwnerPrecondition(
    condition: BotAdministratorPrecondition
  ): void {
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
    ): GuildPermissionsPrecondition =>
      new GuildPermissionsPrecondition(permissions)
  ): void {
    Preconditions.WithPermission = creator;
  }
}

export class Preconditions {
  public static OwnerOnly: BotAdministratorPrecondition;
  public static GuildOnly: RequiresGuildPrecondition;
  public static RequiresSubCommand: RequiresSubCommandsPrecondition;
  public static RequiresSubCommandGroup: RequiresSubCommandsGroupsPrecondition;
  public static WithPermission = (
    permissions: PermissionResolvable
  ): GuildPermissionsPrecondition => {
    return new GuildPermissionsPrecondition(permissions);
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
      preconditions.find((c) => c instanceof GuildPermissionsPrecondition) &&
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
