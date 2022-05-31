import type { ApplicationCommandDataResolvable, Guild } from "discord.js";
import { assertDefinedGet } from "../assertions";
import type { JunaClient } from "../client/JunaClient";
import type { BaseCommandContext } from "../commands/interfaces/CommandContext";
import { DeployHandler } from "./DeployHandler";

export class ClientDeployHandler extends DeployHandler {
  #client: JunaClient;

  public constructor(client: JunaClient, debug: boolean) {
    super(
      assertDefinedGet(client.user).id,
      assertDefinedGet(client.token),
      client.commandProcessor,
      debug,
      client.options.developmentGuild
    );

    this.#client = client;
  }

  public async deployCommand(options: {
    commandName: string;
    context: BaseCommandContext<unknown>;
    guild?: Guild;
  }): Promise<void> {
    const { commandName, guild, context } = options;
    const { interaction } = context;

    const command = this.processor.commands.get(commandName);

    if (!command) {
      return;
    }

    if (!command.name || !command.description) {
      return;
    }

    let path = null;
    if (this.debug) {
      path = guild?.commands ?? interaction?.guild?.commands;
      if (!path) {
        return;
      }
    } else {
      path = this.#client.application?.commands;
    }

    await path?.create(command.toJSON() as ApplicationCommandDataResolvable);
  }
}
