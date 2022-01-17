export default interface CommandProcessorOptions {
  readonly subCommandsDirectory: string;
  readonly subCommandGroupsDirectory: string;
  readonly wrapperDirectory: string;
  readonly ownerIDS: string[];
}
