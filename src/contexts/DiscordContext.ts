import type { Interaction } from "discord.js";
import type SimpleClient from "../client/SimpleClient";

export default interface DiscordContext<A> {
  client: SimpleClient;
  interaction: Interaction;
  args: A;
  build: () => Promise<void>;
}
