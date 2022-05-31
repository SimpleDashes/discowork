import type { CommandPrecondition } from "../CommandPrecondition";

export interface CommandWithPreconditions {
  preconditions: CommandPrecondition[];
}
