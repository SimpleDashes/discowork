import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import type { CommandInterface } from "../interfaces/CommandInterface";

export abstract class JunaSubCommandsGroup
  extends SlashCommandSubcommandGroupBuilder
  implements CommandInterface {}
