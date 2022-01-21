import type ClassLoaderResponse from "./ClassLoaderResponse";
import fs from "fs/promises";
import path from "path";
import Extensions from "../extensions/Extensions";
import { Logger } from "../../container";
import type Directory from "../directories/Directory";
import { pathToFileURL } from "url";
import TypedEventEmitter from "../../events/TypedEventEmitter";
import ConstructorType from "../../types/ConstructorType";
import { getRootInformation, runtimeType } from "../common";

export default class ClassLoader<T> extends TypedEventEmitter<
  "import" | "no_default_export" | "wrong_type"
> {
  #klass: ConstructorType<[...never], T>;
  #extension: Extensions = Extensions.JS;
  #directories: Directory[];

  public constructor(
    klass: ConstructorType<[...never], T>,
    ...directories: Directory[]
  ) {
    super();

    this.#klass = klass;
    this.#directories = directories;
  }

  public async loadAll(): Promise<ClassLoaderResponse<T>[]> {
    const objects: ClassLoaderResponse<T>[] = [];
    for (const directory of this.#directories) {
      objects.push(
        ...(await this.#loadObjectsFromDirectoryWithSubDirectories(directory))
      );
    }
    return objects;
  }

  async #loadObjectsOnDirectory(
    directory: Directory,
    args: never[] = []
  ): Promise<ClassLoaderResponse<T>[]> {
    const response: ClassLoaderResponse<T>[] = [];
    const dir = directory.Path;

    let files = [];
    try {
      files = (
        await fs.readdir(dir, {
          withFileTypes: true,
        })
      ).filter((file) => file.isFile() && file.name.endsWith(this.#extension));
    } catch {
      return [];
    }

    for (const file of files) {
      const realPath = path.join(dir, file.name);

      const importPath =
        getRootInformation().type === runtimeType.module
          ? pathToFileURL(realPath).pathname
          : path.relative(__dirname, realPath);

      const module = await import(importPath);

      if (!module.default) {
        Logger.error(
          `Missing default export trying to import a ${
            this.#klass.name
          } at ${realPath}`
        );
        this.emit("no_default_export");
        continue;
      }

      const klass: ConstructorType<[...never], unknown> = module.default;
      const object = new klass(...args);

      if (object instanceof this.#klass) {
        response.push({
          directory,
          object,
        });
        Logger.log(`Imported a ${klass.name} at ${realPath}.`);
        this.emit("import");
      } else {
        Logger.error(
          `Failed to import a ${
            klass.name
          } at ${realPath}, didn't match expected type: ${this.#klass.name}`
        );
        this.emit("wrong_type");
      }
    }

    return response;
  }

  async #loadObjectsFromDirectoryWithSubDirectories(
    directory: Directory
  ): Promise<ClassLoaderResponse<T>[]> {
    const objects: ClassLoaderResponse<T>[] = [];

    const readDirectory = async (directory: Directory): Promise<void> => {
      objects.push(...(await this.#loadObjectsOnDirectory(directory)));
    };

    if (directory.subDirectories.length === 0) {
      await readDirectory(directory);
    }

    for (const subDirectory of directory.subDirectories) {
      await readDirectory(subDirectory);
    }

    return objects;
  }
}
