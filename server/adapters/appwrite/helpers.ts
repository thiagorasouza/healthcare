import { AppwriteException, Models } from "node-appwrite";

export function isAppwriteException(error: any): error is AppwriteException {
  return (
    typeof error === "object" && error !== null && error.constructor.name === "AppwriteException"
  );
}

export type Appwritify<T> = Omit<T, "id"> & Models.Document;

export type AppwritifyFile<T> = Omit<T, "id"> & Models.File;
