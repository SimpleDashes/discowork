import type { CommandInterface } from "./CommandInterface";
import type { CommandContext } from "./CommandContext";
import type { ConstructorType } from "../../types/ConstructorType";
import type { CommandInteraction } from "discord.js";

export interface WorkerCommand<A, CTX extends CommandContext<A>>
  extends CommandInterface {
  /**
   * The arguments created by {@link createArguments}
   */
  arguments: A;

  /**
   * Runs the command on the provided context.
   */
  trigger: (context: CTX) => Promise<void>;

  /**
   * Provides the context constructor to be passed for the {@link trigger} method.
   */
  getContextConstructor: () => ConstructorType<[CommandInteraction], CTX>;

  /**
   * Provides the arguments to be passed for the {@link getContextConstructor} arguments.
   */
  createArguments: () => A;
}
