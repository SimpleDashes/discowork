import type { ClientOptions } from "discord.js";
import type CommandProcessorOptions from "../processors/commands/CommandProcessorOptions";

export default interface SimpleClientOptions
  extends ClientOptions,
    CommandProcessorOptions {
  readonly ENV_DEVELOPMENT_SERVER: string;
  readonly ENV_TOKEN_VAR: string;
  debug?: boolean;
}
