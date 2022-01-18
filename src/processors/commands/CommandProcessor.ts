import Collection from "@discordjs/collection";
import Command from "../../commands/Command";
import SubCommand from "../../commands/SubCommand";
import SubCommandGroup from "../../commands/SubCommandGroup";
import Directory from "../../io/directories/Directory";
import DirectoryFactory from "../../io/directories/DirectoryFactory";
import ClassLoader from "../../io/loaders/ClassLoader";
import type ClassLoaderResponse from "../../io/loaders/ClassLoaderResponse";
import type CommandProcessorOptions from "./CommandProcessorOptions";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import type { ConstructorType } from "../../types";
import type BaseCommandInterface from "../../commands/types/BaseCommandInterface";
import { Logger } from "../../container";
import DiscordOptionHelper from "../../options/DiscordOptionHelper";
import type IDiscordOption from "../../options/interfaces/IDiscordOption";
import type SimpleCommandInterface from "../../commands/types/SimpleCommandInterface";
import type { Interaction } from "discord.js";
import OwnerPrecondition from "../../preconditions/implementations/OwnerPrecondition";
import { PreconditionUtils, SetupPrecondition } from "../../preconditions";
import RequiresSubCommandsGroupsPrecondition from "../../preconditions/implementations/RequiresSubCommandsGroupsPrecondition";
import RequiresSubCommandsPrecondition from "../../preconditions/implementations/RequiresSubCommandsPrecondition";
import type CommandWithPreconditions from "../../preconditions/interfaces/CommandWithPreconditions";
import type CommandContext from "../../commands/types/CommandContext";
import type { CommandContextOnlyInteractionAndClient } from "../../commands/types/CommandContext";
import SimpleClient from "../../client/SimpleClient";
import assert from "assert";
import TypedEventEmitter from "../../events/TypedEventEmitter";
import { RunOnce, RunOnceWrapper } from "../../decorators/MethodDecorators";

type ArgsLoopListener<O> = (key: string, object: O) => void;

export default class CommandProcessor extends TypedEventEmitter<"load"> {
  public static DEFAULT_COMMAND_PROCESSOR_OPTIONS: CommandProcessorOptions &
    Record<string, unknown> = {
    rootDirectory: path.join("dist", "commands"),
    subCommandsDirectory: "subcommands",
    subCommandGroupsDirectory: "groups",
    wrapperDirectory: "wrapper",
    ownerIDS: [],
  };

  public readonly commands: Collection<string, Command<unknown>> =
    new Collection();

  public readonly subCommands: Collection<
    Command<unknown> | SubCommandGroup,
    SubCommand<unknown>[]
  > = new Collection();

  public readonly subCommandGroups: Collection<
    SubCommand<unknown>,
    SubCommandGroup[]
  > = new Collection();

  readonly #directoryFactory: DirectoryFactory;
  readonly #options: CommandProcessorOptions;

  public constructor(options: Partial<CommandProcessorOptions>) {
    super();

    const { DEFAULT_COMMAND_PROCESSOR_OPTIONS } = CommandProcessor;

    const recordOptions = options as Record<string, unknown>;
    for (const option in DEFAULT_COMMAND_PROCESSOR_OPTIONS) {
      if (!recordOptions[option]) {
        recordOptions[option] = DEFAULT_COMMAND_PROCESSOR_OPTIONS[option];
      }
      Logger.log(`command_processor option: ${recordOptions[option]}`);
    }

    this.#options = options as CommandProcessorOptions;

    this.#directoryFactory = new DirectoryFactory(this.#options.rootDirectory, [
      this.#options.wrapperDirectory,
    ]);

    SetupPrecondition.setup(new OwnerPrecondition(this.#options.ownerIDS));
  }

  @RunOnce()
  public async loadCommands(): Promise<void> {
    const commandDirectories = await this.#directoryFactory.build();

    const commandLoader = new ClassLoader(
      Command as never,
      ...commandDirectories
    );

    const loadedCommands = await commandLoader.loadAll();
    for (const response of loadedCommands) {
      const commandResponse = response as ClassLoaderResponse<Command<unknown>>;
      const command = commandResponse.object;

      this.commands.set(command.name, command);

      const subCommandsConstructor = SubCommand as never;

      const subCommands = await this.#registerSubcommandOrSubcommandGroup(
        commandResponse,
        this.#options.subCommandsDirectory,
        this.subCommands,
        subCommandsConstructor
      );

      subCommands.forEach((res) => command.addSubcommand(res.object));

      const subCommandGroups = await this.#registerSubcommandOrSubcommandGroup(
        commandResponse,
        this.#options.subCommandGroupsDirectory,
        this.subCommandGroups,
        SubCommandGroup as never
      );

      for (const res of subCommandGroups) {
        command.addSubcommandGroup(res.object);
        await this.#registerSubcommandOrSubcommandGroup(
          res,
          this.#options.subCommandsDirectory,
          this.subCommands,
          subCommandsConstructor
        );
      }
    }

    const allSimpleCommands = [
      ...this.commands.values(),
      ...[...this.subCommands.values()].flat(),
    ];

    allSimpleCommands.forEach((simpleCommand) => {
      RunOnceWrapper.decorateMethod(simpleCommand, "createArguments");
      simpleCommand.args = simpleCommand.createArguments();
      this.#loopCommandArguments(simpleCommand, (_k, o) => {
        simpleCommand.options.push(o as never);
      });
    });

    this.emit("load");
  }

  async #registerSubcommandOrSubcommandGroup<
    C extends BaseCommandInterface,
    S extends BaseCommandInterface
  >(
    loadedCommandResponse: ClassLoaderResponse<C>,
    directoryName: string,
    collection: Collection<BaseCommandInterface, S[]>,
    constructor: ConstructorType<[], S>,
    baseDirectory = directoryName
  ): Promise<ClassLoaderResponse<S>[]> {
    const realPath = path.join(
      loadedCommandResponse.directory.Path,
      directoryName
    );

    if (fsSync.existsSync(realPath)) {
      const sysDirectory = (
        await fs.readdir(realPath, {
          withFileTypes: true,
        })
      ).filter((file) => file.isDirectory());

      for (const file of sysDirectory) {
        const filePath = path.join(directoryName, file.name);
        if (
          (baseDirectory === this.#options.subCommandGroupsDirectory &&
            !filePath.endsWith(this.#options.subCommandsDirectory)) ||
          baseDirectory === this.#options.subCommandsDirectory
        ) {
          await this.#registerSubcommandOrSubcommandGroup(
            loadedCommandResponse,
            filePath,
            collection,
            constructor,
            baseDirectory
          );
        }
      }
    }

    const directory = new Directory(directoryName);
    const loader = new ClassLoader(constructor, directory);
    const response = await loader.loadAll();

    const loadedObjects = response.map((o) => o.object);
    const command = collection.get(loadedCommandResponse.object);
    if (command) {
      command.push(...loadedObjects);
    } else {
      collection.set(loadedCommandResponse.object, loadedObjects);
    }

    return response;
  }

  #loopCommandArguments(
    command: SimpleCommandInterface<unknown>,
    onOption?: ArgsLoopListener<IDiscordOption<unknown>>,
    onDefault?: ArgsLoopListener<unknown>
  ): void {
    const verifyIsOption = (
      o: unknown,
      k: string
    ): o is IDiscordOption<unknown> => {
      let isOption = false;

      try {
        isOption = DiscordOptionHelper.isObjectOption(o);
      } catch (e) {
        if (k !== "defaultPermission") {
          Logger.warn(
            `Undefined object at command: ${command.name} [k: ${k}].`
          );
        }
      }

      return isOption;
    };
    const tArgs = command.args as Record<string, unknown>;
    for (const k in tArgs) {
      const o = tArgs[k];
      if (verifyIsOption(o, k) && onOption) {
        onOption(k, o);
      } else if (onDefault) {
        onDefault(k, o);
      }
    }
  }

  public async processCommand(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) return;

    const command = this.commands.get(interaction.commandName);
    if (!command) {
      return;
    }

    const commandHasPreconditions =
      PreconditionUtils.commandContainsPreconditions(command);

    const checkInnerCommandRequired = (
      preconditionClass: ConstructorType<
        [],
        RequiresSubCommandsPrecondition | RequiresSubCommandsGroupsPrecondition
      >
    ): boolean => {
      return commandHasPreconditions
        ? Boolean(
            command.preconditions.find((p) => p instanceof preconditionClass)
          )
        : false;
    };

    const subCommandName = interaction.options.getSubcommand(
      checkInnerCommandRequired(RequiresSubCommandsPrecondition)
    );

    const subCommandGroupName = interaction.options.getSubcommandGroup(
      checkInnerCommandRequired(RequiresSubCommandsGroupsPrecondition)
    );

    let executorParent: BaseCommandInterface = command;
    let executorCommand: SimpleCommandInterface<unknown> = command;

    const getInnerCommand = <C extends BaseCommandInterface>(
      command: BaseCommandInterface,
      collection: Collection<BaseCommandInterface, C[]>,
      name: string
    ): C | undefined => {
      return collection.get(command)?.find((o) => o.name === name);
    };

    if (subCommandGroupName) {
      const subCommandGroup = getInnerCommand(
        command,
        this.subCommandGroups,
        subCommandGroupName
      );
      if (subCommandGroup) {
        executorParent = subCommandGroup;
      }
    }

    if (subCommandName) {
      const subCommand = getInnerCommand(
        executorParent,
        this.subCommands,
        subCommandName
      );
      if (subCommand) {
        executorCommand = subCommand;
      }
    }

    assert(interaction.client instanceof SimpleClient);

    const baseContext: CommandContextOnlyInteractionAndClient = {
      interaction,
      client: interaction.client,
    };

    const contextConstructor = executorCommand.contextConstructor();

    const executorContext = contextConstructor
      ? new contextConstructor(baseContext)
      : (baseContext as CommandContext<unknown>);

    if (contextConstructor) {
      assert(executorContext instanceof contextConstructor);
      await executorContext.build();
    }

    const shouldExecuteCommand = async (
      command: BaseCommandInterface
    ): Promise<boolean> => {
      return PreconditionUtils.commandContainsPreconditions(command)
        ? await this.#verifyPreconditions(command, executorContext)
        : true;
    };

    if (!(await shouldExecuteCommand(command))) return;

    const shouldExecuteInnerCommand = async (
      inner: BaseCommandInterface
    ): Promise<boolean> => {
      return inner === command ? true : await shouldExecuteCommand(inner);
    };

    const inners = [executorParent, executorCommand];
    for (const inner of inners) {
      if (!(await shouldExecuteInnerCommand(inner))) return;
    }

    const recordArgs = (executorContext.args ?? {}) as Record<string, unknown>;

    this.#loopCommandArguments(
      executorCommand,
      (k, o) => {
        if (DiscordOptionHelper.isLazyApplyOption(o)) {
          recordArgs[k] = o;
        } else {
          recordArgs[k] = o.apply(executorContext.interaction);
        }
      },
      (k, o) => {
        recordArgs[k] = o;
      }
    );

    executorContext.args = recordArgs;

    await executorCommand.trigger(executorContext);
  }

  async #verifyPreconditions(
    preconditioned: CommandWithPreconditions,
    context: CommandContext<unknown>
  ): Promise<boolean> {
    for (const precondition of preconditioned.preconditions) {
      if (!(await precondition.validate(context))) {
        return false;
      }
    }
    return true;
  }
}
