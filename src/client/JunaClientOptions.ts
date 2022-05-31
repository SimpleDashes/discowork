import type { ClientOptions, Snowflake } from "discord.js";
import type { CommandProcessorOptions } from "../processors/commands/CommandProcessorOptions";

export interface JunaClientOptions
  extends ClientOptions,
    CommandProcessorOptions {
  debug?: boolean;
  token?: string;
  developmentGuild?: Snowflake;
  botAdministrators: Snowflake[];
}
