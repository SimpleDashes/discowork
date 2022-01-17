import type { RequestData } from "@discordjs/rest";
import { REST } from "@discordjs/rest";
import type { Snowflake } from "discord-api-types/v9";
import { Routes } from "discord-api-types/v9";
import type CommandProcessor from "../processors/commands/CommandProcessor";

export default class DeployHandler {
  #rest = new REST({ version: "9" });
  protected client: Snowflake;
  protected developmentGuild: Snowflake;
  protected token: string;
  protected processor: CommandProcessor;
  protected debug: boolean;

  public constructor(
    client: Snowflake,
    developmentGuild: Snowflake,
    token: string,
    processor: CommandProcessor,
    debug: boolean
  ) {
    this.client = client;
    this.developmentGuild = developmentGuild;
    this.token = token;
    this.processor = processor;
    this.debug = debug;
    this.#rest.setToken(this.token);
  }

  public async deployAll(): Promise<void> {
    const commands = [...this.processor.commands.values()].map((command) =>
      command.toJSON()
    );

    const request: RequestData = { body: commands };

    if (this.debug) {
      await this.#rest.put(
        Routes.applicationGuildCommands(this.client, this.developmentGuild),
        request
      );
    } else {
      await this.#rest.put(Routes.applicationCommands(this.client), request);
    }
  }
}
