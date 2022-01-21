import { SubCommandGroup } from "../../../../commands";
import CommandInformation from "../../../../commands/decorators/CommandInformation";

@CommandInformation({
  name: "lul",
  description: "luls",
})
export default class Lul extends SubCommandGroup {}
