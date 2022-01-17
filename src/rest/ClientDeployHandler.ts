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
      assertDefinedGet(client.information.developmentGuild),
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

    let commandReceiver = null;
    if (this.debug) {
      commandReceiver = guild?.commands ?? interaction?.guild?.commands;
      if (!commandReceiver) {
        return;
      }
    } else {
      commandReceiver = this.#simpleClient.application?.commands;
    }

    await commandReceiver?.create(
      command.toJSON() as ApplicationCommandDataResolvable
    );
  }
}
