import { Result } from "./result";

export interface Success<DataType> extends Result<DataType> {
  success: true;
  message: string;
  data?: DataType;
}

export function success<DataType>(data?: DataType): Success<DataType> {
  return {
    success: true,
    message: "Success",
    data,
  };
}
