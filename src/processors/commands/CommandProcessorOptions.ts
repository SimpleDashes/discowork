import type { Snowflake } from "discord-api-types";

export default interface CommandProcessorOptions {
  rootDirectory: string;
  subCommandsDirectory: string;
  subCommandGroupsDirectory: string;
  wrapperDirectory: string;
  ownerIDS: Snowflake[];
}
