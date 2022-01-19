import type ClassLoaderResponse from "./ClassLoaderResponse";
import fs from "fs/promises";
import path, { join } from "path";
import Extensions from "../extensions/Extensions";
import { Logger } from "../../container";
import type { ConstructorType } from "../../types";
import type Directory from "../directories/Directory";
import { pathToFileURL } from "url";
import { readFileSync } from "fs";

const enum runtimeType {
  module,
  commonJS,
}

type RootInformation = {
  type: runtimeType;
};
export default class ClassLoader<T> {
  static #ROOT_INFORMATION: RootInformation;

  #klass: ConstructorType<[...never], T>;
  #extension: Extensions = Extensions.JS;
  #directories: Directory[];

  public constructor(
    klass: ConstructorType<[...never], T>,
    ...directories: Directory[]
  ) {
    this.#klass = klass;
    this.#directories = directories;

    if (!ClassLoader.#ROOT_INFORMATION) {
      const cwd = process.cwd();

      let info: RootInformation;

      try {
        const file = JSON.parse(
          readFileSync(join(cwd, "package.json"), "utf8")
        );
        info = {
          type:
            file.type === "module" ? runtimeType.module : runtimeType.commonJS,
        };
      } catch {
        info = { type: runtimeType.commonJS };
      }

      ClassLoader.#ROOT_INFORMATION = info;
    }
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
        ClassLoader.#ROOT_INFORMATION.type === runtimeType.module
          ? pathToFileURL(realPath).pathname
          : path.relative(__dirname, realPath);

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
        Logger.log(`Imported a ${klass.name} at ${realPath}.`);
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
