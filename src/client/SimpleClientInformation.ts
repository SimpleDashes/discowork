import type { Snowflake } from "discord.js";

export default interface SimpleClientInformation {
  token?: string;
  developmentGuild?: Snowflake;
  owners: Snowflake[];
}
