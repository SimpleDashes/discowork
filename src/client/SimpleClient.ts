import type { ClientOptions } from "discord.js";
import { Client } from "discord.js";
import { MethodDecoratorFactories } from "../decorators/MethodDecorators";
import CommandProcessor from "../processors/commands/CommandProcessor";
import type SimpleClientInformation from "./SimpleClientInformation";
import type SimpleClientOptions from "./SimpleClientOptions";

export default abstract class SimpleClient extends Client {
  public readonly commandProcessor: CommandProcessor;

  public readonly information: SimpleClientInformation;
  public override readonly options: SimpleClientOptions;

  public constructor(options: ClientOptions & SimpleClientOptions) {
    super(options);

    this.options = options;
    this.commandProcessor = new CommandProcessor(options);

    this.information = {
      owners: this.options.ownerIDS,
      token: process.env[this.options.ENV_TOKEN_VAR],
      developmentGuild: process.env[this.options.ENV_DEVELOPMENT_SERVER],
    };
  }

  public async login(token?: string): Promise<string> {
    const response = await this.login(this.information.token ?? token);

    this.on("ready", async () => {
      const loadedCommandsMeta =
        MethodDecoratorFactories.RunOnce.getMetadataFromTarget(
          this.commandProcessor,
          "loadCommands"
        );
      if (!loadedCommandsMeta?.ran) {
        await this.commandProcessor.loadCommands();
      }
    });

    this.on("interactionCreate", async (interaction) => {
      await this.commandProcessor.processCommand(interaction);
    });

    return response;
  }
}
