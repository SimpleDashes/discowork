import { readFileSync } from "fs";
import { join, dirname } from "path";
import { assertDefinedGet } from "../../assertions";

export const enum runtimeType {
  module,
  commonJS,
}

export type RootInformation = {
  root: string;
  type: runtimeType;
};

let rootInformation: RootInformation;

export const getRootInformation = (): RootInformation => {
  if (rootInformation) return rootInformation;
  const cwd = process.cwd();

  let info: RootInformation;

  try {
    const file = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
    info = {
      root: dirname(join(cwd, file.main)),
      type: file.type === "module" ? runtimeType.module : runtimeType.commonJS,
    };
  } catch {
    info = { root: cwd, type: runtimeType.commonJS };
  }

  rootInformation = info;
  return assertDefinedGet(getRootInformation());
};
