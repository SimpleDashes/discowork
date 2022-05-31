import type { Directory } from "../directories/Directory";

export type ClassLoaderResponse<T> = {
  directory: Directory;
  object: T;
};
