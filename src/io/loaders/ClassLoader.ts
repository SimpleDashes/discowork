import type ClassLoaderResponse from "./ClassLoaderResponse";
import fs from "fs/promises";
import path from "path";
import Extensions from "../extensions/Extensions";
import { Logger } from "../../container";
import type { ConstructorType } from "../../types";
import type Directory from "../directories/Directory";

export default class ClassLoader<T> {
  #klass: ConstructorType<[...never], T>;
  #extension: Extensions = Extensions.JS;
  #directories: Directory[];

  public constructor(
    klass: ConstructorType<[...never], T>,
    ...directories: Directory[]
  ) {
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

    const files = (
      await fs.readdir(dir, {
        withFileTypes: true,
      })
    ).filter((file) => file.isFile() && file.name.endsWith(this.#extension));

    for (const file of files) {
      const realPath = path.join(dir, file.name);
      const importPath = path.relative(__dirname, realPath);

      const module = await import(importPath);

      if (!module.default) {
        Logger.error(
          `Missing default export trying to import a ${
            this.#klass.name
          } at ${realPath}`
        );
        continue;
      }

      const klass: ConstructorType<[...never], unknown> = module.default;
      const object = new klass(...args);

      if (object instanceof this.#klass) {
        response.push({
          directory,
          object,
        });
        Logger.debug(`Imported a ${klass.name} at ${realPath}.`);
      } else {
        Logger.error(
          `Failed to import a ${klass.name} at ${realPath} (wrong type)`
        );
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
