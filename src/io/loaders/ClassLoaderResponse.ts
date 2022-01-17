import type Directory from "../directories/Directory";

type ClassLoaderResponse<T> = {
  directory: Directory;
  object: T;
};

export default ClassLoaderResponse;
