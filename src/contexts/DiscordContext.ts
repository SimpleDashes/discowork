import type { Interaction } from "discord.js";
import type SimpleClient from "../client/SimpleClient";
import type { TypedArgs } from "./TypedArgs";

export default interface DiscordContext<A> {
  client: SimpleClient;
  interaction: Interaction;
  args: TypedArgs<A>;
  build: () => Promise<void>;
}
