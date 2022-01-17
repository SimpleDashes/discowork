export default interface IHasNameAndDescription {
  name: string;
  description: string;
  readonly setName: (name: string) => this;
  readonly setDescription: (description: string) => this;
}
