import fs from "fs/promises";
import path from "path";
import { getRootInformation } from "../common";
import Directory from "./Directory";

export default class DirectoryFactory {
  public readonly root: string;
  public readonly directories: Directory[] = [];
  public readonly excludes: string[];

  /**
   * A {@link DirectoryFactory} is a class that helps creating multiple directories
   * based on a root directory. it recursively fetches the {@link root} directory
   * and assigns their subdirectories accordingly when you call {@link build}
   * @param root The root directory path.
   * @param excludes All the paths to be excluded on subdirectories lookup.
   */
  public constructor(root: string, excludes: string[] = []) {
    this.root = root;
    this.excludes = excludes;
  }

  /**
   * Builds the root directory subdirectories recursively.
   */
  public async build(): Promise<Directory[]> {
    const rootPath = path.join(getRootInformation().root, this.root);
    return await this.#build(rootPath);
  }

  async #build(root = this.root): Promise<Directory[]> {
    const files = (await fs.readdir(root, { withFileTypes: true })).filter(
      (file) => !this.excludes.includes(file.name) && file.isDirectory()
    );

    const directories: Directory[] = [];

    for (const file of files) {
      const directoryPath = path.join(root, file.name);

      const directory = new Directory(directoryPath);
      const subDirectories = await this.#build(directoryPath);

      if (subDirectories.length > 0) directories.push(...subDirectories);

      directories.push(directory);
    }

    return directories;
  }
}
