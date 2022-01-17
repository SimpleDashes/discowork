import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import type BaseCommandInterface from "./types/BaseCommandInterface";

export default abstract class SubCommandGroup
  extends SlashCommandSubcommandGroupBuilder
  implements BaseCommandInterface {}
