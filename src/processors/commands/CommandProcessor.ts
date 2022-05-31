import type { Interaction } from "discord.js";
import { Collection } from "discord.js";
import path from "path";
import type {
  CommandContext,
  CommandInterface,
  WorkerCommand,
} from "../../commands";
import { JunaInactiveCommand } from "../../commands";
import {
  JunaCommand,
  JunaSubCommandsGroup,
  JunaSubCommand,
  commandInformationMetadataFactory,
} from "../../commands";
import { Logger } from "../../container";
import { RunOnceWrapper } from "../../decorators";
import type { NewEvent } from "../../events";
import { AsyncTypedEventEmitter } from "../../events";
import type { ClassLoaderResponse } from "../../io";
import {
  DirectoryFactory,
  ClassLoader,
  ClassLoaderEvents,
  Directory,
} from "../../io";
import type { IDiscordOption } from "../../options";
import { DiscordOptionHelper } from "../../options";
import type { CommandWithPreconditions } from "../../preconditions";
import { SetupPrecondition, PreconditionUtils } from "../../preconditions";
import type { ConstructorType } from "../../types";
import type { CommandProcessorOptions } from "./CommandProcessorOptions";
import fsSync from "fs";
import fs from "fs/promises";
import {
  BotAdministratorPrecondition,
  RequiresSubCommandsPrecondition,
  RequiresSubCommandsGroupsPrecondition,
} from "../../preconditions/implementations";

type ArgsLoopListener<O> = (key: string, object: O) => void;

export enum CommandProcessorEvents {
  // misc
  wrong_command_type = "wrong_command_type",
  command_exception_caught = "command_exception_caught",

  // importing
  command_import = "command_import",
  command_module_no_default_export = "command_module_no_default_export",
  finished_importing_all_commands = "finished_importing_all_commands",

  // trigger
  before_command_trigger = "before_command_trigger",
  after_command_trigger = "after_command_trigger",
}

export class CommandProcessor extends AsyncTypedEventEmitter<
  [
    NewEvent<
      | CommandProcessorEvents.command_import
      | CommandProcessorEvents.command_module_no_default_export
      | CommandProcessorEvents.wrong_command_type
      | CommandProcessorEvents.finished_importing_all_commands
    >,
    NewEvent<
      CommandProcessorEvents.before_command_trigger,
      CommandContext<unknown>[]
    >,
    NewEvent<
      CommandProcessorEvents.after_command_trigger,
      CommandContext<unknown>[]
    >,
    NewEvent<CommandProcessorEvents.command_exception_caught, unknown[]>
  ]
> {
  public static DEFAULT_COMMAND_PROCESSOR_OPTIONS: CommandProcessorOptions &
    Record<string, unknown> = {
    rootDirectory: path.join("commands"),
    subCommandsDirectory: "subcommands",
    subCommandGroupsDirectory: "groups",
    wrapperDirectory: "wrapper",
    botAdministrators: [],
    catchCommandExceptions: false,
  };

  public readonly commands: Collection<
    string,
    JunaCommand<unknown, CommandContext<unknown>>
  > = new Collection();

  public readonly subCommands: Collection<
    JunaCommand<unknown, CommandContext<unknown>> | JunaSubCommandsGroup,
    JunaSubCommand<unknown, CommandContext<unknown>>[]
  > = new Collection();

  public readonly subCommandGroups: Collection<
    JunaSubCommand<unknown, CommandContext<unknown>>,
    JunaSubCommandsGroup[]
  > = new Collection();

  readonly #directoryFactory: DirectoryFactory;
  readonly #options: CommandProcessorOptions;

  #loadedCommands = false;

  public loadedCommands(): boolean {
    return this.#loadedCommands;
  }

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
      this.#options.subCommandsDirectory,
      this.#options.subCommandGroupsDirectory,
      this.#options.wrapperDirectory,
    ]);

    SetupPrecondition.setup(
      new BotAdministratorPrecondition(this.#options.botAdministrators)
    );
  }

  #listenToCommandClassLoader(classLoader: ClassLoader<unknown>): void {
    classLoader
      .on(ClassLoaderEvents.import, async () => {
        await this.emitAsync(CommandProcessorEvents.command_import);
      })
      .on(ClassLoaderEvents.no_default_export, async () => {
        await this.emitAsync(
          CommandProcessorEvents.command_module_no_default_export
        );
      })
      .on(ClassLoaderEvents.wrong_type, async () => {
        await this.emitAsync(CommandProcessorEvents.wrong_command_type);
      });
  }

  public async loadCommands(): Promise<void> {
    if (this.loadedCommands()) {
      return;
    }

    const commandDirectories = await this.#directoryFactory.build();

    const commandLoader = new ClassLoader(
      JunaCommand as never,
      ...commandDirectories
    );

    this.#listenToCommandClassLoader(commandLoader);

    const loadedCommands = await commandLoader.loadAll();

    for (const response of loadedCommands) {
      const commandResponse = response as ClassLoaderResponse<
        JunaCommand<unknown, CommandContext<unknown>>
      >;

      const command = commandResponse.object;

      this.#setMetadataInformationFromCommand(command);

      this.commands.set(command.name, command);

      const subCommandsConstructor = JunaSubCommand as never;

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
        JunaSubCommandsGroup as never
      );

      for (const res of subCommandGroups) {
        const group = res.object;
        command.addSubcommandGroup(group);
        const groupSubCommands =
          await this.#registerSubcommandOrSubcommandGroup(
            res,
            this.#options.subCommandsDirectory,
            this.subCommands,
            subCommandsConstructor
          );
        groupSubCommands.forEach((res) => group.addSubcommand(res.object));
      }
    }

    const allSimpleCommands = [
      ...this.commands.values(),
      ...[...this.subCommands.values()].flat(),
    ];

    allSimpleCommands.forEach((simpleCommand) => {
      /**
       * We don't want to call this more than once.
       */
      RunOnceWrapper.decorateMethod(simpleCommand, "createArguments");

      if (!(simpleCommand instanceof JunaInactiveCommand)) {
        simpleCommand.arguments = simpleCommand.createArguments();
      }

      this.#loopCommandArguments(simpleCommand, (_k, o) => {
        simpleCommand.options.push(o as never);
      });
    });

    await this.emitAsync(
      CommandProcessorEvents.finished_importing_all_commands
    );

    this.#loadedCommands = true;
  }

  #setMetadataInformationFromCommand(command: CommandInterface): void {
    const information = commandInformationMetadataFactory.getMetadataFromTarget(
      command.constructor.prototype
    );

    if (information?.name) command.name = information.name;
    if (information?.description) command.description = information.description;
  }

  async #registerSubcommandOrSubcommandGroup<
    C extends CommandInterface,
    S extends CommandInterface
  >(
    loadedCommandResponse: ClassLoaderResponse<C>,
    directoryName: string,
    collection: Collection<CommandInterface, S[]>,
    constructor: ConstructorType<[], S>,
    baseDirectory = directoryName
  ): Promise<ClassLoaderResponse<S>[]> {
    const realPath = path.join(
      loadedCommandResponse.directory.Path,
      directoryName
    );

    const response: ClassLoaderResponse<S>[] = [];

    if (fsSync.existsSync(realPath)) {
      const sysDirectory = (
        await fs.readdir(realPath, {
          withFileTypes: true,
        })
      ).filter(
        (file) =>
          file.isDirectory() &&
          !this.#directoryFactory.excludes.includes(file.name)
      );
      for (const file of sysDirectory) {
        const filePath = path.join(directoryName, file.name);
        if (
          (baseDirectory === this.#options.subCommandGroupsDirectory &&
            !filePath.endsWith(this.#options.subCommandsDirectory)) ||
          baseDirectory === this.#options.subCommandsDirectory
        ) {
          response.push(
            ...(await this.#registerSubcommandOrSubcommandGroup(
              loadedCommandResponse,
              filePath,
              collection,
              constructor,
              baseDirectory
            ))
          );
        }
      }
    }

    const directory = new Directory(realPath);
    const loader = new ClassLoader<S>(constructor, directory);

    this.#listenToCommandClassLoader(loader);

    response.push(...(await loader.loadAll()));

    const loadedObjects = response.map((o) => o.object);
    const command = collection.get(loadedCommandResponse.object);

    loadedObjects.forEach((object) => {
      this.#setMetadataInformationFromCommand(object);
    });

    if (command) {
      command.push(...loadedObjects);
    } else {
      collection.set(loadedCommandResponse.object, loadedObjects);
    }

    return response;
  }

  #loopCommandArguments(
    command: WorkerCommand<unknown, CommandContext<unknown>>,
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
    const tArgs = command.arguments as Record<string, unknown>;
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

    let executorParent: CommandInterface = command;
    let executorCommand: WorkerCommand<
      unknown,
      CommandContext<unknown>
    > = command;

    const getInnerCommand = <C extends CommandInterface>(
      command: CommandInterface,
      collection: Collection<CommandInterface, C[]>,
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
      const subCommand:
        | JunaSubCommand<unknown, CommandContext<unknown>>
        | undefined = getInnerCommand(
        executorParent,
        this.subCommands,
        subCommandName
      );
      if (subCommand) {
        executorCommand = subCommand;
      }
    }

    await this.emitAsync(
      CommandProcessorEvents.before_command_trigger,
      interaction
    );

    const contextConstructor = executorCommand.getContextConstructor();

    const executorContext = new contextConstructor(interaction);

    const recordArgs = (executorContext.arguments ?? {}) as Record<
      string,
      unknown
    >;

    this.#loopCommandArguments(
      executorCommand,
      (k, o) => {
        recordArgs[k] = DiscordOptionHelper.isLazyApplyOption(o)
          ? o
          : o.apply(executorContext.interaction);
      },
      (k, o) => {
        recordArgs[k] = o;
      }
    );

    executorContext.arguments = recordArgs;

    await executorContext.build();

    const shouldExecuteCommand = async (
      command: CommandInterface
    ): Promise<boolean> => {
      return PreconditionUtils.commandContainsPreconditions(command)
        ? await this.#verifyPreconditions(command, executorContext)
        : true;
    };

    const verifiedCommand = shouldExecuteCommand(command);
    if (!verifiedCommand) return;

    const shouldExecuteInnerCommand = async (
      inner: CommandInterface
    ): Promise<boolean> => {
      return inner === command ? true : await shouldExecuteCommand(inner);
    };

    const inners = [];
    if (executorParent !== command) inners.push(executorParent);
    if (executorCommand !== command) inners.push(executorCommand);

    for (const inner of inners) {
      const verifiedInner = await shouldExecuteInnerCommand(inner);
      if (!verifiedInner) return;
    }

    try {
      await executorCommand.trigger(executorContext);
    } catch (e) {
      if (this.#options.catchCommandExceptions) {
        await this.emitAsync(
          CommandProcessorEvents.command_exception_caught,
          e
        );
        return;
      } else {
        throw e;
      }
    }

    await this.emitAsync(
      CommandProcessorEvents.after_command_trigger,
      executorContext
    );
  }

  async #verifyPreconditions(
    preconditioned: CommandWithPreconditions,
    context: CommandContext<unknown>
  ): Promise<boolean> {
    for (const precondition of preconditioned.preconditions) {
      const verified = await precondition.validate(context);
      if (!verified) return false;
    }
    return true;
  }
}
