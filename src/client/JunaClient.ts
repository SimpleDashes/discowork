import type { ClientEvents, ClientOptions } from "discord.js";
import { Client } from "discord.js";
import type {
  NewEvent,
  SynchronousTypedEventEmitter,
} from "../events/TypedEventEmitter";
import { CommandProcessor } from "../processors/commands/CommandProcessor";
import { ClientDeployHandler } from "../rest/ClientDeployHandler";
import { JunaEvents } from "../types/JunaEvents";
import type { JunaClientOptions } from "./JunaClientOptions";

export class JunaClient
  extends Client
  implements SynchronousTypedEventEmitter<[NewEvent<keyof ClientEvents>]>
{
  public readonly commandProcessor: CommandProcessor;
  public override readonly options: ClientOptions & Partial<JunaClientOptions>;

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

  public constructor(options: ClientOptions & Partial<JunaClientOptions>) {
    super(options);

    this.options = options;
    this.commandProcessor = new CommandProcessor(options);

    this.token = this.options.token ?? this.token;
  }

  public override async login(token?: string): Promise<string> {
    this.once(JunaEvents.ClientReady, async () => {
      await this.commandProcessor.loadCommands();
      this.on(JunaEvents.InteractionCreate, async (interaction) => {
        await this.commandProcessor.processCommand(interaction);
      });
    });

    const response = await super.login(this.token ?? token);

    return response;
  }
}
