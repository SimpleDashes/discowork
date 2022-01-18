import type { ApplicationCommandDataResolvable, Guild } from "discord.js";
import { assertDefinedGet } from "../assertions";
import type SimpleClient from "../client/SimpleClient";
import type CommandContext from "../commands/types/CommandContext";
import DeployHandler from "./DeployHandler";

export default class ClientDeployHandler extends DeployHandler {
  #simpleClient: SimpleClient;

  public constructor(client: SimpleClient, debug: boolean) {
    super(
      assertDefinedGet(client.user).id,
      assertDefinedGet(client.options.developmentGuild),
      assertDefinedGet(client.token),
      client.commandProcessor,
      debug
    );
    this.#simpleClient = client;
  }

  public async deployCommand(options: {
    commandName: string;
    context: CommandContext<unknown>;
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
      path = this.#simpleClient.application?.commands;
    }

    await path?.create(command.toJSON() as ApplicationCommandDataResolvable);
  }
}
