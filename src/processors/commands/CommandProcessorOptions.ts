export default interface CommandProcessorOptions {
  readonly rootDirectory: string;
  readonly subCommandsDirectory: string;
  readonly subCommandGroupsDirectory: string;
  readonly wrapperDirectory: string;
  readonly ownerIDS: string[];
}
