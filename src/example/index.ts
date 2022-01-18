import dotenv from "dotenv";
import SimpleClient from "../client/SimpleClient";
import path from "path";
import { Logger } from "../container";

dotenv.config();

const bot = new SimpleClient({
  intents: ["GUILDS"],
  rootDirectory: path.join("dist", "example", "commands"),
  developmentGuild: process.env["DEV_GUILD"],
  token: process.env["TOKEN"],
});

const main = async (): Promise<void> => {
  await bot.login();
  bot.commandProcessor.on("load", async () => {
    Logger.log("Deploying...");
    await bot.Deployer.deployAll();
    Logger.log("Deployed...");
  });
};

void main().catch();
