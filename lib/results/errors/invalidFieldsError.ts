import { semanticJoin } from "@/lib/utils";
import { error } from "../error";

export const invalidFieldsError = (fieldsList?: string[]) =>
  error(
    `Invalid fields${fieldsList && ": " + semanticJoin(fieldsList)}`,
    fieldsList,
  );
