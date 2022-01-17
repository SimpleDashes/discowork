import type { ConstructorType } from "../../types";
import type BaseCommandInterface from "./BaseCommandInterface";
import type CommandContext from "./CommandContext";
import type { CommandContextOnlyInteractionAndClient } from "./CommandContext";

export default interface SimpleCommandInterface<A>
  extends BaseCommandInterface {
  /**
   * The arguments created by {@link createArguments}
   */
  args: A;

  /**
   * Runs the command on the provided context.
   */
  trigger: (context: CommandContext<A>) => Promise<void>;

  /**
   * Provides the context to be passed for the {@link trigger} method.
   */
  contextConstructor: () =>
    | ConstructorType<
        [CommandContextOnlyInteractionAndClient],
        CommandContext<A>
      >
    | undefined;

  /**
   * Provides the arguments to be passed for the {@link contextConstructor} arguments.
   */
  createArguments: () => A;
}
