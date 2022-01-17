import path from "path";

export default class Directory {
  protected path: string;

  /**
   * The {@link Directory} path.
   */
  public get Path(): string {
    return this.path;
  }

  /**
   * All subdirectories within this directory.
   */
  public readonly subDirectories: Directory[] = [];

  /**
   * A directory is a class that represents a file directory with inner subdirectories.
   * @param rootDirectory The root directory for the directory instance.
   */
  public constructor(rootDirectory: string) {
    this.path = rootDirectory;
  }

  /**
   * Applies rules for a subdirectory such as they path being a subpath of the root directory.
   * @param directory The {@link Directory} to be "ruled".
   */
  #ruleSubDirectory(directory: Directory): void {
    directory.path = path.join(this.path, directory.path);
    directory.subDirectories.forEach((subDirectory) =>
      this.#ruleSubDirectory(subDirectory)
    );
  }

  /**
   * Adds multiple subdirectories for the current {@link Directory}.
   * @param directories All the subdirectories to be added on this {@link Directory}.
   * @returns The root directory of the subdirectories.
   */
  public addSubDirectories(...directories: Directory[]): this {
    directories.forEach((directory) => {
      this.#ruleSubDirectory(directory);
      this.subDirectories.push(directory);
    });
    return this;
  }
}
