export interface Controller {
  handle(formData: FormData): Promise<unknown>;
}
