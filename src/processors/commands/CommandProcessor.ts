import { Collection, Interaction } from "discord.js";
import path from "path";
import SimpleClient from "../../client/SimpleClient";
import Command from "../../commands/classes/Command";
import SubCommand from "../../commands/classes/SubCommand";
import SubCommandGroup from "../../commands/classes/SubCommandGroup";
import CommandContext, {
  CommandContextOnlyInteractionAndClient,
} from "../../commands/interfaces/CommandContext";
import CommandInterface from "../../commands/interfaces/CommandInterface";
import { Logger } from "../../container";
import { RunOnce, RunOnceWrapper } from "../../decorators";
import TypedEventEmitter from "../../events/TypedEventEmitter";
import Directory from "../../io/directories/Directory";
import DirectoryFactory from "../../io/directories/DirectoryFactory";
import ClassLoader from "../../io/loaders/ClassLoader";
import ClassLoaderResponse from "../../io/loaders/ClassLoaderResponse";
import IDiscordOption from "../../options/interfaces/IDiscordOption";
import DiscordOptionHelper from "../../options/utils/DiscordOptionHelper";
import { SetupPrecondition, PreconditionUtils } from "../../preconditions";
import OwnerPrecondition from "../../preconditions/implementations/OwnerPrecondition";
import RequiresSubCommandsGroupsPrecondition from "../../preconditions/implementations/RequiresSubCommandsGroupsPrecondition";
import RequiresSubCommandsPrecondition from "../../preconditions/implementations/RequiresSubCommandsPrecondition";
import CommandWithPreconditions from "../../preconditions/interfaces/CommandWithPreconditions";
import ConstructorType from "../../types/ConstructorType";
import CommandProcessorOptions from "./CommandProcessorOptions";
import fs from "fs/promises";
import fsSync from "fs";
import assert from "assert";
import WorkerCommand from "../../commands/interfaces/WorkerCommand";
import { commandInformationMetadataFactory } from "../../commands";

type ArgsLoopListener<O> = (key: string, object: O) => void;
export default class CommandProcessor extends TypedEventEmitter<
  | "load"
  | "command_import"
  | "command_module_no_default_export"
  | "wrong_command_type"
> {
  public static DEFAULT_COMMAND_PROCESSOR_OPTIONS: CommandProcessorOptions &
    Record<string, unknown> = {
    rootDirectory: path.join("commands"),
    subCommandsDirectory: "subcommands",
    subCommandGroupsDirectory: "groups",
    wrapperDirectory: "wrapper",
    ownerIDS: [],
  };

  public readonly commands: Collection<
    string,
    Command<unknown, CommandContext<unknown>>
  > = new Collection();

  public readonly subCommands: Collection<
    Command<unknown, CommandContext<unknown>> | SubCommandGroup,
    SubCommand<unknown, CommandContext<unknown>>[]
  > = new Collection();

  public readonly subCommandGroups: Collection<
    SubCommand<unknown, CommandContext<unknown>>,
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
      this.#options.subCommandsDirectory,
      this.#options.subCommandGroupsDirectory,
      this.#options.wrapperDirectory,
    ]);

    SetupPrecondition.setup(new OwnerPrecondition(this.#options.ownerIDS));
  }

  #listenToCommandClassLoader(classLoader: ClassLoader<unknown>): void {
    classLoader.on("import", () => this.emit("command_import"));
    classLoader.on("no_default_export", () =>
      this.emit("command_module_no_default_export")
    );
    classLoader.on("wrong_type", () => this.emit("wrong_command_type"));
  }

  @RunOnce()
  public async loadCommands(): Promise<void> {
    const commandDirectories = await this.#directoryFactory.build();

    const commandLoader = new ClassLoader(
      Command as never,
      ...commandDirectories
    );

    this.#listenToCommandClassLoader(commandLoader);

    const loadedCommands = await commandLoader.loadAll();

    for (const response of loadedCommands) {
      const commandResponse = response as ClassLoaderResponse<
        Command<unknown, CommandContext<unknown>>
      >;

      const command = commandResponse.object;

      this.#setMetadataInformationFromCommand(command);

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
      simpleCommand.args = simpleCommand.createArguments();

      this.#loopCommandArguments(simpleCommand, (_k, o) => {
        simpleCommand.options.push(o as never);
      });
    });

    this.emit("load");
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

    const directory = new Directory(realPath);
    const loader = new ClassLoader<S>(constructor, directory);
    this.#listenToCommandClassLoader(loader);
    const response = await loader.loadAll();

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
      command: CommandInterface
    ): Promise<boolean> => {
      return PreconditionUtils.commandContainsPreconditions(command)
        ? await this.#verifyPreconditions(command, executorContext)
        : true;
    };

    if (!(await shouldExecuteCommand(command))) return;

    const shouldExecuteInnerCommand = async (
      inner: CommandInterface
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
