import type CommandPrecondition from "../CommandPrecondition";

export default interface CommandWithPreconditions {
  preconditions: CommandPrecondition[];
}
