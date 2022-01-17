import type { ClientEvents, ClientOptions } from "discord.js";
import { Client } from "discord.js";
import { MethodDecoratorFactories } from "../decorators/MethodDecorators";
import type TypedEventEmitter from "../events/TypedEventEmitter";
import CommandProcessor from "../processors/commands/CommandProcessor";
import ClientDeployHandler from "../rest/ClientDeployHandler";
import type SimpleClientInformation from "./SimpleClientInformation";
import type SimpleClientOptions from "./SimpleClientOptions";

export default class SimpleClient
  extends Client
  implements TypedEventEmitter<keyof ClientEvents>
{
  public readonly commandProcessor: CommandProcessor;
  public readonly information: SimpleClientInformation;

  public override readonly options: ClientOptions &
    Partial<SimpleClientOptions>;

  #deployer?: ClientDeployHandler;

  public get Deployer(): ClientDeployHandler {
    this.#deployer ??= new ClientDeployHandler(
      this,
      Boolean(this.options.debug)
    );
    return this.#deployer;
  }

  public set Deployer(deploy: ClientDeployHandler) {
    this.#deployer = deploy;
  }

  public constructor(options: ClientOptions & Partial<SimpleClientOptions>) {
    super(options);

    this.options = options;
    this.commandProcessor = new CommandProcessor(options);

    this.information = {
      owners: this.options.ownerIDS ?? [],
      token: process.env[this.options.ENV_TOKEN_VAR ?? ""],
      developmentGuild: process.env[this.options.ENV_DEVELOPMENT_SERVER ?? ""],
    };
  }

  public async login(token?: string): Promise<string> {
    const response = await super.login(this.information.token ?? token);

    this.on("ready", async () => {
      const loadedCommandsMeta =
        MethodDecoratorFactories.RunOnce?.getMetadataFromTarget(
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
