import type { RequestData } from "@discordjs/rest";
import { REST } from "@discordjs/rest";
import type { Snowflake } from "discord-api-types/v9";
import { Routes } from "discord-api-types/v9";
import type { CommandProcessor } from "../processors/commands/CommandProcessor";

export class DeployHandler {
  #rest = new REST({ version: "9" });

  protected client: Snowflake;
  protected token: string;
  protected processor: CommandProcessor;
  protected debug: boolean;
  protected developmentGuild?: Snowflake;

  public constructor(
    client: Snowflake,
    token: string,
    processor: CommandProcessor,
    debug: boolean,
    developmentGuild?: Snowflake
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

    if (this.debug && this.developmentGuild) {
      await this.#rest.put(
        Routes.applicationGuildCommands(this.client, this.developmentGuild),
        request
      );
    } else {
      await this.#rest.put(Routes.applicationCommands(this.client), request);
    }
  }
}
