import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import CommandInterface from "../interfaces/CommandInterface";

export default abstract class SubCommandGroup
  extends SlashCommandSubcommandGroupBuilder
  implements CommandInterface {}
