/**
 * Necessary.
 */
import "reflect-metadata";

import dotenv from "dotenv";
import path from "path";
import { JunaClient } from "../client/JunaClient";
import { Logger } from "../container";
import { CommandProcessorEvents } from "../processors";

dotenv.config();

const bot = new JunaClient({
  intents: ["GUILDS"],
  rootDirectory: path.join("example", "commands"),
  developmentGuild: process.env["DEV_GUILD"],
  token: process.env["BOT_TOKEN"],
  debug: true,
});

bot.commandProcessor.once(
  CommandProcessorEvents.finished_importing_all_commands,
  async () => {
    Logger.log("Deploying...");
    await bot.Deployer.deployAll();
    Logger.log("Deployed...");
  }
);

const main = async (): Promise<void> => {
  await bot.login();
};

void main().catch((err) => Logger.error(err));
