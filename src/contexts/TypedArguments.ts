import type { Channel, Role, User } from "discord.js";
import type {
  IDiscordOption,
  BooleanOption,
  ChannelOption,
  IntegerOption,
  NumberOption,
  RoleOption,
  StringOption,
  UserOption,
} from "../options";
import type { ILazyApply } from "../options/interfaces/ILazyApply";

export type MapCommandOption<
  R,
  T extends IDiscordOption<R>
> = T["required"] extends true ? R : R | undefined;

export type TypedArguments<A> = {
  [K in keyof A]: A[K] extends ILazyApply
    ? A[K]
    : A[K] extends BooleanOption
    ? MapCommandOption<boolean, A[K]>
    : A[K] extends ChannelOption
    ? MapCommandOption<Channel, A[K]>
    : A[K] extends IntegerOption | NumberOption
    ? MapCommandOption<number, A[K]>
    : A[K] extends RoleOption
    ? MapCommandOption<Role, A[K]>
    : A[K] extends StringOption
    ? MapCommandOption<string, A[K]>
    : A[K] extends UserOption
    ? MapCommandOption<User, A[K]>
    : A[K];
};

export interface WithTypedArguments<A> {
  arguments: TypedArguments<A>;
}
