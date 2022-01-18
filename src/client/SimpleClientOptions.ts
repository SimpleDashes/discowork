import type { ClientOptions, Snowflake } from "discord.js";
import type CommandProcessorOptions from "../processors/commands/CommandProcessorOptions";

export default interface SimpleClientOptions
  extends ClientOptions,
    CommandProcessorOptions {
  debug?: boolean;
  token?: string;
  developmentGuild?: Snowflake;
  owners: Snowflake[];
}
