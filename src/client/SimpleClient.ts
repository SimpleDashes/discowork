import type { ClientEvents, ClientOptions } from "discord.js";
import { Client } from "discord.js";
import {
  MethodDecoratorFactories,
  RunOnce,
} from "../decorators/MethodDecorators";
import type {
  NewEvent,
  SynchronousTypedEventEmitter,
} from "../events/TypedEventEmitter";
import CommandProcessor from "../processors/commands/CommandProcessor";
import ClientDeployHandler from "../rest/ClientDeployHandler";
import type SimpleClientOptions from "./SimpleClientOptions";

export default class SimpleClient
  extends Client
  implements SynchronousTypedEventEmitter<[NewEvent<keyof ClientEvents>]>
{
  public readonly commandProcessor: CommandProcessor;
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

    this.token = this.options.token ?? this.token;
  }

  /**
   * on("runOnce") equivalent but on a wider scope.
   */
  @RunOnce()
  public async onceLogin(): Promise<void> {
    await this.commandProcessor.loadCommands();
    this.on("interactionCreate", async (interaction) => {
      await this.commandProcessor.processCommand(interaction);
    });
  }

  public override async login(token?: string): Promise<string> {
    const response = await super.login(this.token ?? token);

    const runOnceRan = MethodDecoratorFactories.RunOnce.getMetadataFromTarget(
      this,
      "onceLogin"
    );

    if (!runOnceRan?.ran) {
      await this.onceLogin();
    }

    return response;
  }
}
