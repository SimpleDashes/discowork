import type { ConstructorType } from "../../types";
import type BaseCommandInterface from "../types/BaseCommandInterface";

export function SetupCommand(options: { name: string; description: string }) {
  return (
    target: ConstructorType<[...unknown[]], BaseCommandInterface>
  ): void => {
    const { name, description } = options;
    target.prototype.name = name;
    target.prototype.description = description;
  };
}
