
import type CommandInterface from "./CommandInterface";
import type CommandContext from "./CommandContext";
import type { CommandContextOnlyInteractionAndClient } from "./CommandContext";
import ConstructorType from "../../types/ConstructorType";

export default interface WorkerCommand<A, CTX extends CommandContext<A>>
  extends CommandInterface {
  /**
   * The arguments created by {@link createArguments}
   */
  args: A;

  /**
   * Runs the command on the provided context.
   */
  trigger: (context: CTX) => Promise<void>;

  /**
   * Provides the context to be passed for the {@link trigger} method.
   */
  contextConstructor: () =>
    | ConstructorType<[CommandContextOnlyInteractionAndClient], CTX>
    | undefined;

  /**
   * Provides the arguments to be passed for the {@link contextConstructor} arguments.
   */
  createArguments: () => A;
}
