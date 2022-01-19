import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import type CommandInterface from "./interfaces/CommandInterface";

export default abstract class SubCommandGroup
  extends SlashCommandSubcommandGroupBuilder
  implements CommandInterface {}
