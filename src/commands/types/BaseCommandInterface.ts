import type { ToAPIApplicationCommandOptions } from "@discordjs/builders";
import type {
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types";

export default interface BaseCommandInterface {
  /**
   * The name of the command.
   */
  name: string;

  /**
   * Description of the command, how the command behaves?
   */
  description: string;

  /**
   * The options of the command. StringOptions, ChannelOptions, etc...
   */
  options: ToAPIApplicationCommandOptions[];

  /**
   * The json representation of this command, use it for interacting with the discord api.
   */
  toJSON: () =>
    | RESTPostAPIApplicationCommandsJSONBody
    | APIApplicationCommandSubcommandOption
    | APIApplicationCommandSubcommandGroupOption;
}
