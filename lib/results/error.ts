import { Result } from "./result";

export interface Error<DataType> extends Result<DataType> {
  success: false;
  message: string;
  data: DataType;
}

export function error<DataType>(message: string, data: DataType): Error<DataType> {
  return {
    success: false,
    message,
    data,
  };
}
