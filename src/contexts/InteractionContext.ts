import type { Interaction } from "discord.js";

export interface BaseJunaContext<I extends Interaction> {
  interaction: I;
  build: () => Promise<void>;
}

export type InteractionJunaContext = BaseJunaContext<Interaction>;
