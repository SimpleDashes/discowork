/**
 * Necessary.
 */
import "reflect-metadata";

import dotenv from "dotenv";
import path from "path";
import SimpleClient from "../client/SimpleClient";
import { Logger } from "../container";

dotenv.config();

const bot = new SimpleClient({
  intents: ["GUILDS"],
  rootDirectory: path.join("example", "commands"),
  developmentGuild: process.env["DEV_GUILD"],
  token: process.env["TOKEN"],
});

bot.once("ready", async () => {
  Logger.log("Deploying...");
  await bot.Deployer.deployAll();
  Logger.log("Deployed...");
});

const main = async () => {
  await bot.login();
};

void main().catch((err) => Logger.error(err));
