export interface Result<DataType> {
  success: boolean;
  message: string;
  data?: DataType;
}
