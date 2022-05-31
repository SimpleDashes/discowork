import { JunaInactiveCommand } from "../../../commands/classes/JunaCommand";
import { CommandInformation } from "../../../commands/decorators/CommandInformation";
import { CommandPreconditions, Preconditions } from "../../../preconditions";

@CommandPreconditions(Preconditions.RequiresSubCommandGroup)
@CommandInformation({
  name: "ching",
  description: "Ching...",
})
export default class Ching extends JunaInactiveCommand {}
