/// <reference types="node" />
declare module "assertions/index" {
    export function assertDefined<T>(object: T): asserts object is NonNullable<T>;
    export function assertDefinedGet<T>(object: T | undefined | null): NonNullable<T>;
}
declare module "decorators/metadata/BaseMetadataFactory" {
    import { Collection } from "discord.js";
    export type ObjectKeyString<T> = keyof T & string;
    export default abstract class MetadataFactory<M> {
        protected readonly id: string;
        protected readonly ids: Collection<unknown, string>;
        getMetadataName(target: object, name: string): string;
        getMetadataFromTarget(target: object, name: string): M | undefined;
        setMetadataFromTarget(metadata: M, target: object, name: string): void;
    }
}
declare module "decorators/metadata/MethodMetadataFactory" {
    import type { ObjectKeyString } from "decorators/metadata/BaseMetadataFactory";
    import BaseMetadataFactory from "decorators/metadata/BaseMetadataFactory";
    export default class MethodMetadataFactory<M> extends BaseMetadataFactory<M> {
        getMetadataName<T extends object>(target: T, name: ObjectKeyString<T>): string;
        getMetadataFromTarget<T extends object>(target: T, name: ObjectKeyString<T>): M | undefined;
        setMetadataFromTarget<T extends object>(metadata: M, target: T, name: ObjectKeyString<T>): void;
    }
}
declare module "decorators/MethodDecorators" {
    import MethodMetadataFactory from "decorators/metadata/MethodMetadataFactory";
    export class MethodDecoratorFactories {
        static readonly RunOnce: MethodMetadataFactory<{
            ran: true;
        }>;
    }
    abstract class MethodDecorator {
        static decorateMethod<T extends object>(target: T, name: keyof T): void;
        static decorateTarget<T extends object>(target: T, name: keyof T, propertyDescriptor: PropertyDescriptor): void;
        static internalDecorate<T extends object>(_target: T, _name: keyof T): void;
    }
    export class RunOnceWrapper extends MethodDecorator {
        static internalDecorate<T extends object>(target: T, name: keyof T & string): void;
    }
    export const RunOnce: () => <T extends object>(target: T, name: keyof T, descriptor: PropertyDescriptor) => void;
}
declare module "events/TypedEventEmitter" {
    import EventEmitter from "node:events";
    export default class TypedEventEmitter<T extends string, A = []> extends EventEmitter {
        emit(eventName: T, ...args: A[]): boolean;
        on(eventName: T, listener: (...args: A[]) => void): this;
    }
}
declare module "types/ConstructorType" {
    type ConstructorType<A extends unknown[], T> = {
        new (...args: A): T;
        prototype: T;
    };
    export default ConstructorType;
}
declare module "interfaces/IHasNameAndDescription" {
    export default interface IHasNameAndDescription {
        name: string;
        description: string;
    }
}
declare module "options/interfaces/IDiscordOption" {
    import type { CommandInteraction } from "discord.js";
    import type IHasNameAndDescription from "interfaces/IHasNameAndDescription";
    export default interface IDiscordOption<R> extends IHasNameAndDescription {
        required: boolean;
        type: number;
        apply: (interaction: CommandInteraction) => R | null;
        setRequired: (required: boolean) => this;
        toJSON: () => unknown;
    }
}
declare module "options/classes/BooleanOption" {
    import { SlashCommandBooleanOption } from "@discordjs/builders";
    import type { CommandInteraction } from "discord.js";
    import type IDiscordOption from "options/interfaces/IDiscordOption";
    export default class BooleanOption extends SlashCommandBooleanOption implements IDiscordOption<boolean> {
        apply(interaction: CommandInteraction, returnDefault?: boolean): boolean;
    }
}
declare module "options/classes/ChannelOption" {
    import { SlashCommandChannelOption } from "@discordjs/builders";
    import type { CommandInteraction } from "discord.js";
    import { GuildChannel, ThreadChannel } from "discord.js";
    import type IDiscordOption from "options/interfaces/IDiscordOption";
    export default class ChannelOption extends SlashCommandChannelOption implements IDiscordOption<GuildChannel | ThreadChannel> {
        apply(interaction: CommandInteraction): GuildChannel | ThreadChannel | null;
    }
}
declare module "options/classes/IntegerOption" {
    import { SlashCommandIntegerOption } from "@discordjs/builders";
    import type { CommandInteraction } from "discord.js";
    import type IDiscordOption from "options/interfaces/IDiscordOption";
    export default class IntegerOption extends SlashCommandIntegerOption implements IDiscordOption<number> {
        apply(interaction: CommandInteraction): number | null;
    }
}
declare module "options/classes/MentionableOption" {
    import { SlashCommandMentionableOption } from "@discordjs/builders";
    import type { CommandInteraction } from "discord.js";
    import { GuildMember, Role, User } from "discord.js";
    import type IDiscordOption from "options/interfaces/IDiscordOption";
    export default class MentionableOptions extends SlashCommandMentionableOption implements IDiscordOption<GuildMember | Role | User> {
        apply(interaction: CommandInteraction): Role | User | GuildMember | null;
    }
}
declare module "options/classes/NumberOption" {
    import { SlashCommandNumberOption } from "@discordjs/builders";
    import type { CommandInteraction } from "discord.js";
    import type IDiscordOption from "options/interfaces/IDiscordOption";
    export default class NumberOption extends SlashCommandNumberOption implements IDiscordOption<number> {
        apply(interaction: CommandInteraction): number | null;
    }
}
declare module "options/classes/RoleOption" {
    import { SlashCommandRoleOption } from "@discordjs/builders";
    import type { CommandInteraction } from "discord.js";
    import { Role } from "discord.js";
    import type IDiscordOption from "options/interfaces/IDiscordOption";
    export default class RoleOption extends SlashCommandRoleOption implements IDiscordOption<Role> {
        apply(interaction: CommandInteraction): Role | null;
    }
}
declare module "options/classes/StringOption" {
    import { SlashCommandStringOption } from "@discordjs/builders";
    import type { CommandInteraction } from "discord.js";
    import type IDiscordOption from "options/interfaces/IDiscordOption";
    export default class StringOption extends SlashCommandStringOption implements IDiscordOption<string> {
        apply(interaction: CommandInteraction): string | null;
    }
}
declare module "options/classes/UserOption" {
    import { SlashCommandUserOption } from "@discordjs/builders";
    import { GuildMember } from "discord.js";
    import type { CommandInteraction, User } from "discord.js";
    import type IDiscordOption from "options/interfaces/IDiscordOption";
    export default class UserOption extends SlashCommandUserOption implements IDiscordOption<User> {
        readonly defaultToSelf: boolean;
        constructor(defaultToSelf?: boolean);
        apply(interaction: CommandInteraction): User | null;
        applyAsMember(interaction: CommandInteraction): GuildMember | null;
    }
}
declare module "options/interfaces/ILazyApply" {
    interface ILazyApply {
        readonly lazyApply: true;
    }
    export type { ILazyApply };
}
declare module "contexts/TypedArgs" {
    import type { Channel, GuildMember, Role, User } from "discord.js";
    import type BooleanOption from "options/classes/BooleanOption";
    import type ChannelOption from "options/classes/ChannelOption";
    import type IntegerOption from "options/classes/IntegerOption";
    import type MentionableOptions from "options/classes/MentionableOption";
    import type NumberOption from "options/classes/NumberOption";
    import type RoleOption from "options/classes/RoleOption";
    import type StringOption from "options/classes/StringOption";
    import type UserOption from "options/classes/UserOption";
    import type IDiscordOption from "options/interfaces/IDiscordOption";
    import type { ILazyApply } from "options/interfaces/ILazyApply";
    export type MapCommandOption<R, T extends IDiscordOption<R>> = T["required"] extends true ? R : R | undefined;
    export type TypedArgs<A> = {
        [K in keyof A]: A[K] extends ILazyApply ? A[K] : A[K] extends BooleanOption ? MapCommandOption<boolean, A[K]> : A[K] extends ChannelOption ? MapCommandOption<Channel, A[K]> : A[K] extends IntegerOption | NumberOption ? MapCommandOption<number, A[K]> : A[K] extends MentionableOptions ? MapCommandOption<GuildMember | Role | User, A[K]> : A[K] extends RoleOption ? MapCommandOption<Role, A[K]> : A[K] extends StringOption ? MapCommandOption<string, A[K]> : A[K] extends UserOption ? MapCommandOption<User, A[K]> : A[K];
    };
}
declare module "contexts/DiscordContext" {
    import type { Interaction } from "discord.js";
    import type SimpleClient from "client/SimpleClient";
    import type { TypedArgs } from "contexts/TypedArgs";
    export default interface DiscordContext<A> {
        client: SimpleClient;
        interaction: Interaction;
        args: TypedArgs<A>;
        build: () => Promise<void>;
    }
    type DiscordContextOnlyInteractionAndClient = Pick<DiscordContext<unknown>, "interaction" | "client">;
    export type { DiscordContextOnlyInteractionAndClient };
}
declare module "commands/interfaces/CommandContext" {
    import type { CommandInteraction } from "discord.js";
    import type DiscordContext from "contexts/DiscordContext";
    export default interface CommandContext<A> extends DiscordContext<A> {
        readonly interaction: CommandInteraction;
    }
    type CommandContextOnlyInteractionAndClient = Pick<CommandContext<unknown>, "interaction" | "client">;
    export type { CommandContextOnlyInteractionAndClient };
}
declare module "types/index" {
    import type ConstructorType from "types/ConstructorType";
    export type { ConstructorType };
}
declare module "commands/interfaces/CommandInterface" {
    import type { ToAPIApplicationCommandOptions } from "@discordjs/builders";
    import type { APIApplicationCommandSubcommandGroupOption, APIApplicationCommandSubcommandOption, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";
    export default interface CommandInterface {
        name: string;
        description: string;
        options: ToAPIApplicationCommandOptions[];
        toJSON: () => RESTPostAPIApplicationCommandsJSONBody | APIApplicationCommandSubcommandOption | APIApplicationCommandSubcommandGroupOption;
    }
}
declare module "commands/interfaces/WorkerCommand" {
    import type { ConstructorType } from "types/index";
    import type CommandInterface from "commands/interfaces/CommandInterface";
    import type CommandContext from "commands/interfaces/CommandContext";
    import type { CommandContextOnlyInteractionAndClient } from "commands/interfaces/CommandContext";
    export default interface WorkerCommand<A, CTX extends CommandContext<A>> extends CommandInterface {
        args: A;
        trigger: (context: CTX) => Promise<void>;
        contextConstructor: () => ConstructorType<[CommandContextOnlyInteractionAndClient], CTX> | undefined;
        createArguments: () => A;
    }
}
declare module "commands/Command" {
    import { SlashCommandBuilder } from "@discordjs/builders";
    import type ConstructorType from "types/ConstructorType";
    import type CommandContext from "commands/interfaces/CommandContext";
    import type { CommandContextOnlyInteractionAndClient } from "commands/interfaces/CommandContext";
    import type WorkerCommand from "commands/interfaces/WorkerCommand";
    export default abstract class Command<A, CTX extends CommandContext<A>> extends SlashCommandBuilder implements WorkerCommand<A, CTX> {
        args: A;
        abstract trigger(context: CTX): Promise<void>;
        abstract contextConstructor(): ConstructorType<[CommandContextOnlyInteractionAndClient], CTX> | undefined;
        abstract createArguments(): A;
    }
}
declare module "commands/SubCommand" {
    import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
    import type { ConstructorType } from "types/index";
    import type CommandContext from "commands/interfaces/CommandContext";
    import type { CommandContextOnlyInteractionAndClient } from "commands/interfaces/CommandContext";
    import type WorkerCommand from "commands/interfaces/WorkerCommand";
    export default abstract class SubCommand<A, CTX extends CommandContext<A>> extends SlashCommandSubcommandBuilder implements WorkerCommand<A, CTX> {
        args: A;
        abstract trigger(context: CTX): Promise<void>;
        abstract contextConstructor(): ConstructorType<[
            CommandContextOnlyInteractionAndClient
        ], CTX>;
        abstract createArguments(): A;
    }
}
declare module "commands/SubCommandGroup" {
    import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
    import type CommandInterface from "commands/interfaces/CommandInterface";
    export default abstract class SubCommandGroup extends SlashCommandSubcommandGroupBuilder implements CommandInterface {
    }
}
declare module "io/directories/Directory" {
    export default class Directory {
        #private;
        protected path: string;
        get Path(): string;
        readonly subDirectories: Directory[];
        constructor(rootDirectory: string);
        addSubDirectories(...directories: Directory[]): this;
    }
}
declare module "io/directories/DirectoryFactory" {
    import Directory from "io/directories/Directory";
    export default class DirectoryFactory {
        #private;
        readonly root: string;
        readonly directories: Directory[];
        readonly excludes: string[];
        constructor(root: string, excludes?: string[]);
        build(): Promise<Directory[]>;
    }
}
declare module "io/loaders/ClassLoaderResponse" {
    import type Directory from "io/directories/Directory";
    type ClassLoaderResponse<T> = {
        directory: Directory;
        object: T;
    };
    export default ClassLoaderResponse;
}
declare module "io/extensions/Extensions" {
    enum Extensions {
        JS = "js",
        TS = "ts"
    }
    export default Extensions;
}
declare module "container/index" {
    export const Logger: import("consola").Consola;
}
declare module "io/loaders/ClassLoader" {
    import type ClassLoaderResponse from "io/loaders/ClassLoaderResponse";
    import type { ConstructorType } from "types/index";
    import type Directory from "io/directories/Directory";
    import TypedEventEmitter from "events/TypedEventEmitter";
    export default class ClassLoader<T> extends TypedEventEmitter<"import" | "no_default_export" | "wrong_type"> {
        #private;
        constructor(klass: ConstructorType<[...never], T>, ...directories: Directory[]);
        loadAll(): Promise<ClassLoaderResponse<T>[]>;
    }
}
declare module "processors/commands/CommandProcessorOptions" {
    import type { Snowflake } from "discord-api-types";
    export default interface CommandProcessorOptions {
        rootDirectory: string;
        subCommandsDirectory: string;
        subCommandGroupsDirectory: string;
        wrapperDirectory: string;
        ownerIDS: Snowflake[];
    }
}
declare module "options/DiscordOptionHelper" {
    import type IDiscordOption from "options/interfaces/IDiscordOption";
    import type { ILazyApply } from "options/interfaces/ILazyApply";
    export default class DiscordOptionHelper {
        static isObjectOption(object: unknown): object is IDiscordOption<unknown>;
        static isLazyApplyOption(object: unknown): object is ILazyApply;
    }
}
declare module "utils/InteractionUtils" {
    import type { APIMessage } from "discord-api-types";
    import type { ButtonInteraction, CacheType, CommandInteraction, InteractionReplyOptions, InteractionUpdateOptions, Message, MessageComponentInteraction, MessagePayload, WebhookEditMessageOptions } from "discord.js";
    export default class InteractionUtils {
        static reply(interaction: CommandInteraction<CacheType> | MessageComponentInteraction<CacheType>, options?: string | MessagePayload | WebhookEditMessageOptions | (InteractionReplyOptions & {
            fetchReply: true;
        })): Promise<void | APIMessage | Message<boolean>>;
        static safeUpdate(interaction: ButtonInteraction, options: string | MessagePayload | InteractionUpdateOptions): Promise<void>;
    }
}
declare module "preconditions/CommandPrecondition" {
    import type CommandContext from "commands/interfaces/CommandContext";
    export default abstract class CommandPrecondition {
        onFailMessage?: (context: CommandContext<unknown>) => string;
        validate(context: CommandContext<unknown>): Promise<boolean>;
        protected abstract validateInternally(context: CommandContext<unknown>): Promise<boolean>;
    }
}
declare module "preconditions/implementations/OwnerPrecondition" {
    import type { Snowflake } from "discord.js";
    import type CommandContext from "commands/interfaces/CommandContext";
    import CommandPrecondition from "preconditions/CommandPrecondition";
    export default class OwnerPrecondition extends CommandPrecondition {
        ownerIDS: Snowflake[];
        constructor(ownerIDS: Snowflake[]);
        protected validateInternally(context: CommandContext<unknown>): Promise<boolean>;
    }
}
declare module "preconditions/implementations/GuildPermissionsPreconditions" {
    import type { PermissionResolvable } from "discord.js";
    import type CommandContext from "commands/interfaces/CommandContext";
    import CommandPrecondition from "preconditions/CommandPrecondition";
    export default class GuildPermissionsPrecondition extends CommandPrecondition {
        readonly requiredPermissions: PermissionResolvable;
        constructor(requiredPermissions: PermissionResolvable);
        protected validateInternally(context: CommandContext<unknown>): Promise<boolean>;
    }
}
declare module "preconditions/interfaces/CommandWithPreconditions" {
    import type CommandPrecondition from "preconditions/CommandPrecondition";
    export default interface CommandWithPreconditions {
        preconditions: CommandPrecondition[];
    }
}
declare module "preconditions/implementations/RequiresGuildPrecondition" {
    import type CommandContext from "commands/interfaces/CommandContext";
    import CommandPrecondition from "preconditions/CommandPrecondition";
    export default class RequiresGuildPrecondition extends CommandPrecondition {
        protected validateInternally(context: CommandContext<unknown>): Promise<boolean>;
    }
}
declare module "preconditions/implementations/RequiresSubCommandsPrecondition" {
    import type CommandContext from "commands/interfaces/CommandContext";
    import CommandPrecondition from "preconditions/CommandPrecondition";
    export default class RequiresSubCommandsPrecondition extends CommandPrecondition {
        protected validateInternally(context: CommandContext<unknown>): Promise<boolean>;
    }
}
declare module "preconditions/implementations/RequiresSubCommandsGroupsPrecondition" {
    import type CommandContext from "commands/interfaces/CommandContext";
    import CommandPrecondition from "preconditions/CommandPrecondition";
    export default class RequiresSubCommandsGroupsPrecondition extends CommandPrecondition {
        protected validateInternally(context: CommandContext<unknown>): Promise<boolean>;
    }
}
declare module "preconditions/index" {
    import type { PermissionResolvable } from "discord.js";
    import type CommandPrecondition from "preconditions/CommandPrecondition";
    import GuildPermissionsPreconditions from "preconditions/implementations/GuildPermissionsPreconditions";
    import type CommandWithPreconditions from "preconditions/interfaces/CommandWithPreconditions";
    import type OwnerPrecondition from "preconditions/implementations/OwnerPrecondition";
    import RequiresGuildPrecondition from "preconditions/implementations/RequiresGuildPrecondition";
    import RequiresSubCommandsPrecondition from "preconditions/implementations/RequiresSubCommandsPrecondition";
    import RequiresSubCommandsGroupsPrecondition from "preconditions/implementations/RequiresSubCommandsGroupsPrecondition";
    import type { ConstructorType } from "types/index";
    import type CommandInterface from "commands/interfaces/CommandInterface";
    export class PreconditionUtils {
        static commandContainsPreconditions(command: unknown): command is CommandWithPreconditions;
    }
    export class SetupPrecondition {
        static setup(owner: OwnerPrecondition): void;
        static setupOwnerPrecondition(condition: OwnerPrecondition): void;
        static setupGuildPrecondition(condition?: RequiresGuildPrecondition): void;
        static setupSubCommandPrecondition(condition?: RequiresSubCommandsPrecondition): void;
        static setupSubCommandGroupsPrecondition(condition?: RequiresSubCommandsGroupsPrecondition): void;
        static setupGuildPermissionsPrecondition(creator?: (permissions: PermissionResolvable) => GuildPermissionsPreconditions): void;
    }
    export class Preconditions {
        static OwnerOnly: OwnerPrecondition;
        static GuildOnly: RequiresGuildPrecondition;
        static RequiresSubCommand: RequiresSubCommandsPrecondition;
        static RequiresSubCommandGroup: RequiresSubCommandsGroupsPrecondition;
        static WithPermission: (permissions: PermissionResolvable) => GuildPermissionsPreconditions;
    }
    function CommandPreconditions(...preconditions: CommandPrecondition[]): (target: ConstructorType<[...unknown[]], CommandInterface>) => void;
    export { CommandPreconditions };
}
declare module "decorators/metadata/ClassMetadataFactory" {
    import BaseMetadataFactory from "decorators/metadata/BaseMetadataFactory";
    export default class ClassMetadataFactory<M> extends BaseMetadataFactory<M> {
        #private;
        getMetadataName<T extends object>(target: T): string;
        getMetadataFromTarget<T extends object>(target: T): M | undefined;
        setMetadataFromTarget<T extends object>(metadata: M, target: T): void;
    }
}
declare module "commands/decorators/index" {
    import ClassMetadataFactory from "decorators/metadata/ClassMetadataFactory";
    import type IHasNameAndDescription from "interfaces/IHasNameAndDescription";
    import type { ConstructorType } from "types/index";
    import type CommandInterface from "commands/interfaces/CommandInterface";
    export const commandInformationMetadataFactory: ClassMetadataFactory<IHasNameAndDescription>;
    export function CommandInformation(options: {
        name: string;
        description: string;
    }): (target: ConstructorType<[], CommandInterface>) => void;
}
declare module "processors/commands/CommandProcessor" {
    import Collection from "@discordjs/collection";
    import Command from "commands/Command";
    import SubCommand from "commands/SubCommand";
    import SubCommandGroup from "commands/SubCommandGroup";
    import type CommandProcessorOptions from "processors/commands/CommandProcessorOptions";
    import type { Interaction } from "discord.js";
    import type CommandContext from "commands/interfaces/CommandContext";
    import TypedEventEmitter from "events/TypedEventEmitter";
    export default class CommandProcessor extends TypedEventEmitter<"load" | "command_import" | "command_module_no_default_export" | "wrong_command_type"> {
        #private;
        static DEFAULT_COMMAND_PROCESSOR_OPTIONS: CommandProcessorOptions & Record<string, unknown>;
        readonly commands: Collection<string, Command<unknown, CommandContext<unknown>>>;
        readonly subCommands: Collection<Command<unknown, CommandContext<unknown>> | SubCommandGroup, SubCommand<unknown, CommandContext<unknown>>[]>;
        readonly subCommandGroups: Collection<SubCommand<unknown, CommandContext<unknown>>, SubCommandGroup[]>;
        constructor(options: Partial<CommandProcessorOptions>);
        loadCommands(): Promise<void>;
        processCommand(interaction: Interaction): Promise<void>;
    }
}
declare module "rest/DeployHandler" {
    import type { Snowflake } from "discord-api-types/v9";
    import type CommandProcessor from "processors/commands/CommandProcessor";
    export default class DeployHandler {
        #private;
        protected client: Snowflake;
        protected developmentGuild: Snowflake;
        protected token: string;
        protected processor: CommandProcessor;
        protected debug: boolean;
        constructor(client: Snowflake, developmentGuild: Snowflake, token: string, processor: CommandProcessor, debug: boolean);
        deployAll(): Promise<void>;
    }
}
declare module "rest/ClientDeployHandler" {
    import type { Guild } from "discord.js";
    import type SimpleClient from "client/SimpleClient";
    import type CommandContext from "commands/interfaces/CommandContext";
    import DeployHandler from "rest/DeployHandler";
    export default class ClientDeployHandler extends DeployHandler {
        #private;
        constructor(client: SimpleClient, debug: boolean);
        deployCommand(options: {
            commandName: string;
            context: CommandContext<unknown>;
            guild?: Guild;
        }): Promise<void>;
    }
}
declare module "client/SimpleClientOptions" {
    import type { ClientOptions, Snowflake } from "discord.js";
    import type CommandProcessorOptions from "processors/commands/CommandProcessorOptions";
    export default interface SimpleClientOptions extends ClientOptions, CommandProcessorOptions {
        debug?: boolean;
        token?: string;
        developmentGuild?: Snowflake;
        ownerIDS: Snowflake[];
    }
}
declare module "client/SimpleClient" {
    import type { ClientEvents, ClientOptions } from "discord.js";
    import { Client } from "discord.js";
    import type TypedEventEmitter from "events/TypedEventEmitter";
    import CommandProcessor from "processors/commands/CommandProcessor";
    import ClientDeployHandler from "rest/ClientDeployHandler";
    import type SimpleClientOptions from "client/SimpleClientOptions";
    export default class SimpleClient extends Client implements TypedEventEmitter<keyof ClientEvents> {
        #private;
        readonly commandProcessor: CommandProcessor;
        readonly options: ClientOptions & Partial<SimpleClientOptions>;
        get Deployer(): ClientDeployHandler;
        set Deployer(deploy: ClientDeployHandler);
        constructor(options: ClientOptions & Partial<SimpleClientOptions>);
        login(token?: string): Promise<string>;
    }
}
declare module "collections/LimitedCapacityCollection" {
    import { Collection } from "discord.js";
    export class LimitedCapacityCollection<K, V> extends Collection<K, V> {
        #private;
        protected readonly capacity: number;
        constructor(capacity: number, lifetime: number, sweepInterval?: number);
        set(key: K, value: V): this;
    }
}
declare module "example/index" {
    import "reflect-metadata";
}
declare module "example/commands/fun/OwO" {
    import Command from "commands/Command";
    import type { CommandContextOnlyInteractionAndClient } from "commands/interfaces/CommandContext";
    import type CommandContext from "commands/interfaces/CommandContext";
    import BooleanOption from "options/classes/BooleanOption";
    import type { ConstructorType } from "types/index";
    type Args = {
        yum: BooleanOption;
    };
    export default class OwO extends Command<Args, CommandContext<Args>> {
        createArguments(): Args;
        trigger(context: CommandContext<Args>): Promise<void>;
        contextConstructor(): ConstructorType<[
            CommandContextOnlyInteractionAndClient
        ], CommandContext<Args>> | undefined;
    }
}
declare module "localization/Locale" {
    enum Locale {
        af = "af",
        af_NA = "af-NA",
        af_ZA = "af-ZA",
        agq = "agq",
        agq_CM = "agq-CM",
        ak = "ak",
        ak_GH = "ak-GH",
        am = "am",
        am_ET = "am-ET",
        ar = "ar",
        ar_001 = "ar-001",
        ar_AE = "ar-AE",
        ar_BH = "ar-BH",
        ar_DZ = "ar-DZ",
        ar_EG = "ar-EG",
        ar_IQ = "ar-IQ",
        ar_JO = "ar-JO",
        ar_KW = "ar-KW",
        ar_LB = "ar-LB",
        ar_LY = "ar-LY",
        ar_MA = "ar-MA",
        ar_OM = "ar-OM",
        ar_QA = "ar-QA",
        ar_SA = "ar-SA",
        ar_SD = "ar-SD",
        ar_SY = "ar-SY",
        ar_TN = "ar-TN",
        ar_YE = "ar-YE",
        as = "as",
        as_IN = "as-IN",
        asa = "asa",
        asa_TZ = "asa-TZ",
        az = "az",
        az_Cyrl = "az-Cyrl",
        az_Cyrl_AZ = "az-Cyrl-AZ",
        az_Latn = "az-Latn",
        az_Latn_AZ = "az-Latn-AZ",
        bas = "bas",
        bas_CM = "bas-CM",
        be = "be",
        be_BY = "be-BY",
        bem = "bem",
        bem_ZM = "bem-ZM",
        bez = "bez",
        bez_TZ = "bez-TZ",
        bg = "bg",
        bg_BG = "bg-BG",
        bm = "bm",
        bm_ML = "bm-ML",
        bn = "bn",
        bn_BD = "bn-BD",
        bn_IN = "bn-IN",
        bo = "bo",
        bo_CN = "bo-CN",
        bo_IN = "bo-IN",
        br = "br",
        br_FR = "br-FR",
        brx = "brx",
        brx_IN = "brx-IN",
        bs = "bs",
        bs_BA = "bs-BA",
        ca = "ca",
        ca_ES = "ca-ES",
        cgg = "cgg",
        cgg_UG = "cgg-UG",
        chr = "chr",
        chr_US = "chr-US",
        cs = "cs",
        cs_CZ = "cs-CZ",
        cy = "cy",
        cy_GB = "cy-GB",
        da = "da",
        da_DK = "da-DK",
        dav = "dav",
        dav_KE = "dav-KE",
        de = "de",
        de_AT = "de-AT",
        de_BE = "de-BE",
        de_CH = "de-CH",
        de_DE = "de-DE",
        de_LI = "de-LI",
        de_LU = "de-LU",
        dje = "dje",
        dje_NE = "dje-NE",
        dua = "dua",
        dua_CM = "dua-CM",
        dyo = "dyo",
        dyo_SN = "dyo-SN",
        ebu = "ebu",
        ebu_KE = "ebu-KE",
        ee = "ee",
        ee_GH = "ee-GH",
        ee_TG = "ee-TG",
        el = "el",
        el_CY = "el-CY",
        el_GR = "el-GR",
        en = "en",
        en_AE = "en-AE",
        en_AR = "en-AR",
        en_AS = "en-AS",
        en_AT = "en-AT",
        en_AU = "en-AU",
        en_BB = "en-BB",
        en_BE = "en-BE",
        en_BG = "en-BG",
        en_BH = "en-BH",
        en_BM = "en-BM",
        en_BR = "en-BR",
        en_BW = "en-BW",
        en_BZ = "en-BZ",
        en_CA = "en-CA",
        en_CH = "en-CH",
        en_CL = "en-CL",
        en_CN = "en-CN",
        en_CO = "en-CO",
        en_CR = "en-CR",
        en_CY = "en-CY",
        en_CZ = "en-CZ",
        en_DE = "en-DE",
        en_DK = "en-DK",
        en_DO = "en-DO",
        en_EE = "en-EE",
        en_EG = "en-EG",
        en_ES = "en-ES",
        en_FI = "en-FI",
        en_GB = "en-GB",
        en_GE = "en-GE",
        en_GF = "en-GF",
        en_GH = "en-GH",
        en_GI = "en-GI",
        en_GR = "en-GR",
        en_GU = "en-GU",
        en_GY = "en-GY",
        en_HK = "en-HK",
        en_HR = "en-HR",
        en_HU = "en-HU",
        en_ID = "en-ID",
        en_IE = "en-IE",
        en_IL = "en-IL",
        en_IN = "en-IN",
        en_IS = "en-IS",
        en_IT = "en-IT",
        en_JM = "en-JM",
        en_JO = "en-JO",
        en_JP = "en-JP",
        en_KR = "en-KR",
        en_KW = "en-KW",
        en_KY = "en-KY",
        en_LB = "en-LB",
        en_LI = "en-LI",
        en_LT = "en-LT",
        en_LU = "en-LU",
        en_LV = "en-LV",
        en_MA = "en-MA",
        en_MC = "en-MC",
        en_MG = "en-MG",
        en_MH = "en-MH",
        en_MK = "en-MK",
        en_MO = "en-MO",
        en_MP = "en-MP",
        en_MT = "en-MT",
        en_MU = "en-MU",
        en_MX = "en-MX",
        en_MY = "en-MY",
        en_NA = "en-NA",
        en_NL = "en-NL",
        en_NO = "en-NO",
        en_NZ = "en-NZ",
        en_OM = "en-OM",
        en_PE = "en-PE",
        en_PH = "en-PH",
        en_PK = "en-PK",
        en_PL = "en-PL",
        en_PR = "en-PR",
        en_PT = "en-PT",
        en_PY = "en-PY",
        en_QA = "en-QA",
        en_RO = "en-RO",
        en_RU = "en-RU",
        en_SA = "en-SA",
        en_SE = "en-SE",
        en_SG = "en-SG",
        en_SK = "en-SK",
        en_SI = "en-SI",
        en_TH = "en-TH",
        en_TR = "en-TR",
        en_TT = "en-TT",
        en_TW = "en-TW",
        en_UA = "en-UA",
        en_UM = "en-UM",
        en_US = "en-US",
        en_US_POSIX = "en-US-POSIX",
        en_UY = "en-UY",
        en_VE = "en-VE",
        en_VI = "en-VI",
        en_VN = "en-VN",
        en_ZA = "en-ZA",
        en_ZW = "en-ZW",
        eo = "eo",
        es = "es",
        es_419 = "es-419",
        es_AR = "es-AR",
        es_BO = "es-BO",
        es_CL = "es-CL",
        es_CO = "es-CO",
        es_CR = "es-CR",
        es_DO = "es-DO",
        es_EC = "es-EC",
        es_ES = "es-ES",
        es_GQ = "es-GQ",
        es_GT = "es-GT",
        es_HN = "es-HN",
        es_MX = "es-MX",
        es_NI = "es-NI",
        es_PA = "es-PA",
        es_PE = "es-PE",
        es_PR = "es-PR",
        es_PY = "es-PY",
        es_SV = "es-SV",
        es_US = "es-US",
        es_UY = "es-UY",
        es_VE = "es-VE",
        et = "et",
        et_EE = "et-EE",
        eu = "eu",
        eu_ES = "eu-ES",
        ewo = "ewo",
        ewo_CM = "ewo-CM",
        fa = "fa",
        fa_AF = "fa-AF",
        fa_IR = "fa-IR",
        ff = "ff",
        ff_SN = "ff-SN",
        fi = "fi",
        fi_FI = "fi-FI",
        fil = "fil",
        fil_PH = "fil-PH",
        fo = "fo",
        fo_FO = "fo-FO",
        fr = "fr",
        fr_BE = "fr-BE",
        fr_BF = "fr-BF",
        fr_BI = "fr-BI",
        fr_BJ = "fr-BJ",
        fr_BL = "fr-BL",
        fr_CA = "fr-CA",
        fr_CD = "fr-CD",
        fr_CF = "fr-CF",
        fr_CG = "fr-CG",
        fr_CH = "fr-CH",
        fr_CI = "fr-CI",
        fr_CM = "fr-CM",
        fr_DJ = "fr-DJ",
        fr_FR = "fr-FR",
        fr_GA = "fr-GA",
        fr_GF = "fr-GF",
        fr_GN = "fr-GN",
        fr_GP = "fr-GP",
        fr_GQ = "fr-GQ",
        fr_KM = "fr-KM",
        fr_LU = "fr-LU",
        fr_MC = "fr-MC",
        fr_MF = "fr-MF",
        fr_MG = "fr-MG",
        fr_ML = "fr-ML",
        fr_MQ = "fr-MQ",
        fr_NE = "fr-NE",
        fr_RE = "fr-RE",
        fr_RW = "fr-RW",
        fr_SN = "fr-SN",
        fr_TD = "fr-TD",
        fr_TG = "fr-TG",
        fr_YT = "fr-YT",
        ga = "ga",
        ga_IE = "ga-IE",
        gl = "gl",
        gl_ES = "gl-ES",
        gsw = "gsw",
        gsw_CH = "gsw-CH",
        gu = "gu",
        gu_IN = "gu-IN",
        guz = "guz",
        guz_KE = "guz-KE",
        gv = "gv",
        gv_GB = "gv-GB",
        ha = "ha",
        ha_Latn = "ha-Latn",
        ha_Latn_GH = "ha-Latn-GH",
        ha_Latn_NE = "ha-Latn-NE",
        ha_Latn_NG = "ha-Latn-NG",
        haw = "haw",
        haw_US = "haw-US",
        he = "he",
        he_IL = "he-IL",
        hi = "hi",
        hi_IN = "hi-IN",
        hr = "hr",
        hr_HR = "hr-HR",
        hu = "hu",
        hu_HU = "hu-HU",
        hy = "hy",
        hy_AM = "hy-AM",
        id = "id",
        id_ID = "id-ID",
        ig = "ig",
        ig_NG = "ig-NG",
        ii = "ii",
        ii_CN = "ii-CN",
        is = "is",
        is_IS = "is-IS",
        it = "it",
        it_CH = "it-CH",
        it_IT = "it-IT",
        ja = "ja",
        ja_JP = "ja-JP",
        jmc = "jmc",
        jmc_TZ = "jmc-TZ",
        ka = "ka",
        ka_GE = "ka-GE",
        kab = "kab",
        kab_DZ = "kab-DZ",
        kam = "kam",
        kam_KE = "kam-KE",
        kde = "kde",
        kde_TZ = "kde-TZ",
        kea = "kea",
        kea_CV = "kea-CV",
        khq = "khq",
        khq_ML = "khq-ML",
        ki = "ki",
        ki_KE = "ki-KE",
        kk = "kk",
        kk_Cyrl = "kk-Cyrl",
        kk_Cyrl_KZ = "kk-Cyrl-KZ",
        kl = "kl",
        kl_GL = "kl-GL",
        kln = "kln",
        kln_KE = "kln-KE",
        km = "km",
        km_KH = "km-KH",
        kn = "kn",
        kn_IN = "kn-IN",
        ko = "ko",
        ko_KR = "ko-KR",
        kok = "kok",
        kok_IN = "kok-IN",
        ksb = "ksb",
        ksb_TZ = "ksb-TZ",
        ksf = "ksf",
        ksf_CM = "ksf-CM",
        kw = "kw",
        kw_GB = "kw-GB",
        lag = "lag",
        lag_TZ = "lag-TZ",
        lg = "lg",
        lg_UG = "lg-UG",
        ln = "ln",
        ln_CD = "ln-CD",
        ln_CG = "ln-CG",
        lt = "lt",
        lt_LT = "lt-LT",
        lu = "lu",
        lu_CD = "lu-CD",
        luo = "luo",
        luo_KE = "luo-KE",
        luy = "luy",
        luy_KE = "luy-KE",
        lv = "lv",
        lv_LV = "lv-LV",
        mas = "mas",
        mas_KE = "mas-KE",
        mas_TZ = "mas-TZ",
        mer = "mer",
        mer_KE = "mer-KE",
        mfe = "mfe",
        mfe_MU = "mfe-MU",
        mg = "mg",
        mg_MG = "mg-MG",
        mgh = "mgh",
        mgh_MZ = "mgh-MZ",
        mk = "mk",
        mk_MK = "mk-MK",
        ml = "ml",
        ml_IN = "ml-IN",
        mr = "mr",
        mr_IN = "mr-IN",
        ms = "ms",
        ms_BN = "ms-BN",
        ms_MY = "ms-MY",
        mt = "mt",
        mt_MT = "mt-MT",
        mua = "mua",
        mua_CM = "mua-CM",
        my = "my",
        my_MM = "my-MM",
        naq = "naq",
        naq_NA = "naq-NA",
        nb = "nb",
        nb_NO = "nb-NO",
        nd = "nd",
        nd_ZW = "nd-ZW",
        ne = "ne",
        ne_IN = "ne-IN",
        ne_NP = "ne-NP",
        nl = "nl",
        nl_AW = "nl-AW",
        nl_BE = "nl-BE",
        nl_CW = "nl-CW",
        nl_NL = "nl-NL",
        nl_SX = "nl-SX",
        nmg = "nmg",
        nmg_CM = "nmg-CM",
        nn = "nn",
        nn_NO = "nn-NO",
        nus = "nus",
        nus_SD = "nus-SD",
        nyn = "nyn",
        nyn_UG = "nyn-UG",
        om = "om",
        om_ET = "om-ET",
        om_KE = "om-KE",
        or = "or",
        or_IN = "or-IN",
        pa = "pa",
        pa_Arab = "pa-Arab",
        pa_Arab_PK = "pa-Arab-PK",
        pa_Guru = "pa-Guru",
        pa_Guru_IN = "pa-Guru-IN",
        pl = "pl",
        pl_PL = "pl-PL",
        ps = "ps",
        ps_AF = "ps-AF",
        pt = "pt",
        pt_AO = "pt-AO",
        pt_BR = "pt-BR",
        pt_GW = "pt-GW",
        pt_MZ = "pt-MZ",
        pt_PT = "pt-PT",
        pt_ST = "pt-ST",
        rm = "rm",
        rm_CH = "rm-CH",
        rn = "rn",
        rn_BI = "rn-BI",
        ro = "ro",
        ro_MD = "ro-MD",
        ro_RO = "ro-RO",
        rof = "rof",
        rof_TZ = "rof-TZ",
        ru = "ru",
        ru_MD = "ru-MD",
        ru_RU = "ru-RU",
        ru_UA = "ru-UA",
        rw = "rw",
        rw_RW = "rw-RW",
        rwk = "rwk",
        rwk_TZ = "rwk-TZ",
        saq = "saq",
        saq_KE = "saq-KE",
        sbp = "sbp",
        sbp_TZ = "sbp-TZ",
        seh = "seh",
        seh_MZ = "seh-MZ",
        ses = "ses",
        ses_ML = "ses-ML",
        sg = "sg",
        sg_CF = "sg-CF",
        shi = "shi",
        shi_Latn = "shi-Latn",
        shi_Latn_MA = "shi-Latn-MA",
        shi_Tfng = "shi-Tfng",
        shi_Tfng_MA = "shi-Tfng-MA",
        si = "si",
        si_LK = "si-LK",
        sk = "sk",
        sk_SK = "sk-SK",
        sl = "sl",
        sl_SI = "sl-SI",
        sn = "sn",
        sn_ZW = "sn-ZW",
        so = "so",
        so_DJ = "so-DJ",
        so_ET = "so-ET",
        so_KE = "so-KE",
        so_SO = "so-SO",
        sq = "sq",
        sq_AL = "sq-AL",
        sr = "sr",
        sr_Cyrl = "sr-Cyrl",
        sr_Cyrl_BA = "sr-Cyrl-BA",
        sr_Cyrl_ME = "sr-Cyrl-ME",
        sr_Cyrl_RS = "sr-Cyrl-RS",
        sr_Latn = "sr-Latn",
        sr_Latn_BA = "sr-Latn-BA",
        sr_Latn_ME = "sr-Latn-ME",
        sr_Latn_RS = "sr-Latn-RS",
        sv = "sv",
        sv_FI = "sv-FI",
        sv_SE = "sv-SE",
        sw = "sw",
        sw_KE = "sw-KE",
        sw_TZ = "sw-TZ",
        swc = "swc",
        swc_CD = "swc-CD",
        ta = "ta",
        ta_IN = "ta-IN",
        ta_LK = "ta-LK",
        te = "te",
        te_IN = "te-IN",
        teo = "teo",
        teo_KE = "teo-KE",
        teo_UG = "teo-UG",
        th = "th",
        th_TH = "th-TH",
        ti = "ti",
        ti_ER = "ti-ER",
        ti_ET = "ti-ET",
        to = "to",
        to_TO = "to-TO",
        tr = "tr",
        tr_TR = "tr-TR",
        twq = "twq",
        twq_NE = "twq-NE",
        tzm = "tzm",
        tzm_Latn = "tzm-Latn",
        tzm_Latn_MA = "tzm-Latn-MA",
        uk = "uk",
        uk_UA = "uk-UA",
        ur = "ur",
        ur_IN = "ur-IN",
        ur_PK = "ur-PK",
        uz = "uz",
        uz_Arab = "uz-Arab",
        uz_Arab_AF = "uz-Arab-AF",
        uz_Cyrl = "uz-Cyrl",
        uz_Cyrl_UZ = "uz-Cyrl-UZ",
        uz_Latn = "uz-Latn",
        uz_Latn_UZ = "uz-Latn-UZ",
        vai = "vai",
        vai_Latn = "vai-Latn",
        vai_Latn_LR = "vai-Latn-LR",
        vai_Vaii = "vai-Vaii",
        vai_Vaii_LR = "vai-Vaii-LR",
        vi = "vi",
        vi_VN = "vi-VN",
        vun = "vun",
        vun_TZ = "vun-TZ",
        xog = "xog",
        xog_UG = "xog-UG",
        yav = "yav",
        yav_CM = "yav-CM",
        yo = "yo",
        yo_NG = "yo-NG",
        zh = "zh",
        zh_Hans = "zh-Hans",
        zh_Hans_AE = "zh-Hans-AE",
        zh_Hans_AR = "zh-Hans-AR",
        zh_Hans_AT = "zh-Hans-AT",
        zh_Hans_AU = "zh-Hans-AU",
        zh_Hans_BE = "zh-Hans-BE",
        zh_Hans_BG = "zh-Hans-BG",
        zh_Hans_BH = "zh-Hans-BH",
        zh_Hans_BR = "zh-Hans-BR",
        zh_Hans_BW = "zh-Hans-BW",
        zh_Hans_CA = "zh-Hans-CA",
        zh_Hans_CH = "zh-Hans-CH",
        zh_Hans_CL = "zh-Hans-CL",
        zh_Hans_CN = "zh-Hans-CN",
        zh_Hans_CO = "zh-Hans-CO",
        zh_Hans_CR = "zh-Hans-CR",
        zh_Hans_CY = "zh-Hans-CY",
        zh_Hans_CZ = "zh-Hans-CZ",
        zh_Hans_DE = "zh-Hans-DE",
        zh_Hans_DK = "zh-Hans-DK",
        zh_Hans_DO = "zh-Hans-DO",
        zh_Hans_EE = "zh-Hans-EE",
        zh_Hans_EG = "zh-Hans-EG",
        zh_Hans_ES = "zh-Hans-ES",
        zh_Hans_FI = "zh-Hans-FI",
        zh_Hans_GB = "zh-Hans-GB",
        zh_Hans_GE = "zh-Hans-GE",
        zh_Hans_GF = "zh-Hans-GF",
        zh_Hans_GH = "zh-Hans-GH",
        zh_Hans_GI = "zh-Hans-GI",
        zh_Hans_GR = "zh-Hans-GR",
        zh_Hans_HK = "zh-Hans-HK",
        zh_Hans_HR = "zh-Hans-HR",
        zh_Hans_HU = "zh-Hans-HU",
        zh_Hans_ID = "zh-Hans-ID",
        zh_Hans_IE = "zh-Hans-IE",
        zh_Hans_IL = "zh-Hans-IL",
        zh_Hans_IN = "zh-Hans-IN",
        zh_Hans_IS = "zh-Hans-IS",
        zh_Hans_IT = "zh-Hans-IT",
        zh_Hans_JO = "zh-Hans-JO",
        zh_Hans_JP = "zh-Hans-JP",
        zh_Hans_KR = "zh-Hans-KR",
        zh_Hans_KW = "zh-Hans-KW",
        zh_Hans_KY = "zh-Hans-KY",
        zh_Hans_LB = "zh-Hans-LB",
        zh_Hans_LI = "zh-Hans-LI",
        zh_Hans_LT = "zh-Hans-LT",
        zh_Hans_LU = "zh-Hans-LU",
        zh_Hans_LV = "zh-Hans-LV",
        zh_Hans_MA = "zh-Hans-MA",
        zh_Hans_MC = "zh-Hans-MC",
        zh_Hans_MG = "zh-Hans-MG",
        zh_Hans_MK = "zh-Hans-MK",
        zh_Hans_MO = "zh-Hans-MO",
        zh_Hans_MT = "zh-Hans-MT",
        zh_Hans_MU = "zh-Hans-MU",
        zh_Hans_MX = "zh-Hans-MX",
        zh_Hans_MY = "zh-Hans-MY",
        zh_Hans_NA = "zh-Hans-NA",
        zh_Hans_NL = "zh-Hans-NL",
        zh_Hans_NO = "zh-Hans-NO",
        zh_Hans_NZ = "zh-Hans-NZ",
        zh_Hans_OM = "zh-Hans-OM",
        zh_Hans_PE = "zh-Hans-PE",
        zh_Hans_PH = "zh-Hans-PH",
        zh_Hans_PK = "zh-Hans-PK",
        zh_Hans_PL = "zh-Hans-PL",
        zh_Hans_PR = "zh-Hans-PR",
        zh_Hans_PT = "zh-Hans-PT",
        zh_Hans_PY = "zh-Hans-PY",
        zh_Hans_QA = "zh-Hans-QA",
        zh_Hans_RO = "zh-Hans-RO",
        zh_Hans_RU = "zh-Hans-RU",
        zh_Hans_SA = "zh-Hans-SA",
        zh_Hans_SE = "zh-Hans-SE",
        zh_Hans_SG = "zh-Hans-SG",
        zh_Hans_SK = "zh-Hans-SK",
        zh_Hans_SI = "zh-Hans-SI",
        zh_Hans_TH = "zh-Hans-TH",
        zh_Hans_TR = "zh-Hans-TR",
        zh_Hans_TW = "zh-Hans-TW",
        zh_Hans_UA = "zh-Hans-UA",
        zh_Hans_US = "zh-Hans-US",
        zh_Hans_UY = "zh-Hans-UY",
        zh_Hans_VE = "zh-Hans-VE",
        zh_Hans_VN = "zh-Hans-VN",
        zh_Hans_ZA = "zh-Hans-ZA",
        zh_Hant = "zh-Hant",
        zh_Hant_AE = "zh-Hant-AE",
        zh_Hant_AR = "zh-Hant-AR",
        zh_Hant_AT = "zh-Hant-AT",
        zh_Hant_AU = "zh-Hant-AU",
        zh_Hant_BE = "zh-Hant-BE",
        zh_Hant_BG = "zh-Hant-BG",
        zh_Hant_BH = "zh-Hant-BH",
        zh_Hant_BR = "zh-Hant-BR",
        zh_Hant_BW = "zh-Hant-BW",
        zh_Hant_CA = "zh-Hant-CA",
        zh_Hant_CH = "zh-Hant-CH",
        zh_Hant_CL = "zh-Hant-CL",
        zh_Hant_CN = "zh-Hant-CN",
        zh_Hant_CO = "zh-Hant-CO",
        zh_Hant_CR = "zh-Hant-CR",
        zh_Hant_CY = "zh-Hant-CY",
        zh_Hant_CZ = "zh-Hant-CZ",
        zh_Hant_DE = "zh-Hant-DE",
        zh_Hant_DK = "zh-Hant-DK",
        zh_Hant_DO = "zh-Hant-DO",
        zh_Hant_EE = "zh-Hant-EE",
        zh_Hant_EG = "zh-Hant-EG",
        zh_Hant_ES = "zh-Hant-ES",
        zh_Hant_FI = "zh-Hant-FI",
        zh_Hant_GB = "zh-Hant-GB",
        zh_Hant_GE = "zh-Hant-GE",
        zh_Hant_GF = "zh-Hant-GF",
        zh_Hant_GH = "zh-Hant-GH",
        zh_Hant_GI = "zh-Hant-GI",
        zh_Hant_GR = "zh-Hant-GR",
        zh_Hant_HK = "zh-Hant-HK",
        zh_Hant_HR = "zh-Hant-HR",
        zh_Hant_HU = "zh-Hant-HU",
        zh_Hant_ID = "zh-Hant-ID",
        zh_Hant_IE = "zh-Hant-IE",
        zh_Hant_IL = "zh-Hant-IL",
        zh_Hant_IN = "zh-Hant-IN",
        zh_Hant_IS = "zh-Hant-IS",
        zh_Hant_IT = "zh-Hant-IT",
        zh_Hant_JO = "zh-Hant-JO",
        zh_Hant_JP = "zh-Hant-JP",
        zh_Hant_KR = "zh-Hant-KR",
        zh_Hant_KW = "zh-Hant-KW",
        zh_Hant_KY = "zh-Hant-KY",
        zh_Hant_LB = "zh-Hant-LB",
        zh_Hant_LI = "zh-Hant-LI",
        zh_Hant_LT = "zh-Hant-LT",
        zh_Hant_LU = "zh-Hant-LU",
        zh_Hant_LV = "zh-Hant-LV",
        zh_Hant_MA = "zh-Hant-MA",
        zh_Hant_MC = "zh-Hant-MC",
        zh_Hant_MG = "zh-Hant-MG",
        zh_Hant_MK = "zh-Hant-MK",
        zh_Hant_MO = "zh-Hant-MO",
        zh_Hant_MT = "zh-Hant-MT",
        zh_Hant_MU = "zh-Hant-MU",
        zh_Hant_MX = "zh-Hant-MX",
        zh_Hant_MY = "zh-Hant-MY",
        zh_Hant_NA = "zh-Hant-NA",
        zh_Hant_NL = "zh-Hant-NL",
        zh_Hant_NO = "zh-Hant-NO",
        zh_Hant_NZ = "zh-Hant-NZ",
        zh_Hant_OM = "zh-Hant-OM",
        zh_Hant_PE = "zh-Hant-PE",
        zh_Hant_PH = "zh-Hant-PH",
        zh_Hant_PK = "zh-Hant-PK",
        zh_Hant_PL = "zh-Hant-PL",
        zh_Hant_PR = "zh-Hant-PR",
        zh_Hant_PT = "zh-Hant-PT",
        zh_Hant_PY = "zh-Hant-PY",
        zh_Hant_QA = "zh-Hant-QA",
        zh_Hant_RO = "zh-Hant-RO",
        zh_Hant_RU = "zh-Hant-RU",
        zh_Hant_SA = "zh-Hant-SA",
        zh_Hant_SE = "zh-Hant-SE",
        zh_Hant_SG = "zh-Hant-SG",
        zh_Hant_SK = "zh-Hant-SK",
        zh_Hant_SI = "zh-Hant-SI",
        zh_Hant_TH = "zh-Hant-TH",
        zh_Hant_TR = "zh-Hant-TR",
        zh_Hant_TW = "zh-Hant-TW",
        zh_Hant_UA = "zh-Hant-UA",
        zh_Hant_US = "zh-Hant-US",
        zh_Hant_UY = "zh-Hant-UY",
        zh_Hant_VE = "zh-Hant-VE",
        zh_Hant_VN = "zh-Hant-VN",
        zh_Hant_ZA = "zh-Hant-ZA",
        zu = "zu",
        zu_ZA = "zu-ZA"
    }
    export default Locale;
}
declare module "localization/resources/LocaleResource" {
    export default class LocaleResource<S, T> {
        readonly locale: S;
        readonly structure: T;
        constructor(locale: S, structure: T);
    }
}
declare module "localization/resources/ResourceValue" {
    class ResourceValue<A extends string = never> {
        #private;
        args: A[];
        get Value(): string;
        constructor(builder: (placeholder: Record<A, string>) => string[] | string, args: A[], variableSettings?: import("localization/Localizer").VariableSettings);
    }
    export default ResourceValue;
}
declare module "localization/Localizer" {
    import type ClassLoader from "io/loaders/ClassLoader";
    import type Locale from "localization/Locale";
    import type LocaleResource from "localization/resources/LocaleResource";
    import type ResourceValue from "localization/resources/ResourceValue";
    export type VariableSettings = {
        prefix: string;
        suffix: string;
    };
    export default abstract class Localizer<S extends Locale, T, R extends LocaleResource<S, T>> {
        #private;
        static defaultVariableSettings: VariableSettings;
        readonly defaultLocale: S;
        constructor(defaultLocale: S, resourceResolver: ClassLoader<R>, variableSettings?: VariableSettings);
        static getVariableNameForSetting(variable: string, settings: VariableSettings): string;
        build(): Promise<void>;
        getTranslation<A extends string, K extends ResourceValue<A>>(locale: S | undefined, keyProvider: (key: T) => K, placeholders: {
            [K in A]: string;
        }): string;
    }
}
declare module "options/custom/PageOption" {
    import type { CommandInteraction } from "discord.js";
    import IntegerOption from "options/classes/IntegerOption";
    import type { ILazyApply } from "options/interfaces/ILazyApply";
    export default class PageOption extends IntegerOption implements ILazyApply {
        readonly lazyApply: true;
        readonly itemsPerPage: number;
        constructor(itemsPerPage: number);
        apply<T>(interaction: CommandInteraction, res?: T[]): number;
    }
}
declare module "reflect/TypedReflect" {
    export default class TypedReflect {
        static defineProperty<T extends object>(target: T, propertyKey: keyof T, attributes: PropertyDescriptor): boolean;
        static deleteProperty<T extends object>(target: T, propertyKey: keyof T): boolean;
        static ownKeys<T extends object>(target: T): (string | symbol)[];
        static apply<O, A, R, T extends (...args: A[]) => R>(target: T, thisArgument: O, argumentsList: ArrayLike<A>): R;
        static construct<A, R, T extends (...args: A[]) => R>(target: T, argumentsList: ArrayLike<A>, newTarget?: T | undefined): R;
        static get<T extends object>(target: T, propertyKey: keyof T, receiver?: T): unknown;
        static getOwnPropertyDescriptor<T extends object>(target: T, propertyKey: keyof T): PropertyDescriptor | undefined;
        static getPrototypeOf<T extends object>(target: T): T | null;
        static has<T extends object>(target: T, propertyKey: keyof T): boolean;
        static isExtensible<T extends object>(target: T): boolean;
        static preventExtensions<T extends object>(target: T): boolean;
        static set<T extends object>(target: T, propertyKey: keyof T, value: unknown, receiver?: unknown): boolean;
        static setPrototypeOf<T extends object>(target: T, proto: T | null): boolean;
    }
}
declare module "reflect/ReflectWrite" {
    type GetterSetter<T> = {
        get: () => T;
        set: (v: T) => void;
    };
    export function createProperty(value: unknown): GetterSetter<unknown>;
    export function makePropertyWritable<T, K extends keyof T & string, V>(object: T & Record<keyof T, unknown>, name: K, value?: V extends undefined ? never : V): void;
}
