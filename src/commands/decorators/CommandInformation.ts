import ClassMetadataFactory from "../../decorators/metadata/ClassMetadataFactory";
import type IHasNameAndDescription from "../../interfaces/IHasNameAndDescription";
import ConstructorType from "../../types/ConstructorType";
import type CommandInterface from "../interfaces/CommandInterface";

export const commandInformationMetadataFactory =
  new ClassMetadataFactory<IHasNameAndDescription>();

export default function CommandInformation(options: {
  name: string;
  description: string;
}) {
  return (target: ConstructorType<[], CommandInterface>): void => {
    const { name, description } = options;
    commandInformationMetadataFactory.setMetadataFromTarget(
      {
        name,
        description,
      },
      target.prototype
    );
  };
}
