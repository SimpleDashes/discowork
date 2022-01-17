import type { CommandInteraction } from "discord.js";
import type IHasNameAndDescription from "../../interfaces/IHasNameAndDescription";

export default interface IDiscordOption<R> extends IHasNameAndDescription {
  required: boolean;
  type: number;
  apply: (interaction: CommandInteraction) => R | null;
  setRequired: (required: boolean) => this;
  toJSON: () => unknown;
}
