import type { Snowflake } from "discord-api-types";

export interface CommandProcessorOptions {
  rootDirectory: string;
  subCommandsDirectory: string;
  subCommandGroupsDirectory: string;
  wrapperDirectory: string;
  botAdministrators: Snowflake[];
  catchCommandExceptions: boolean;
}
