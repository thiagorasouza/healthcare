export interface ActionController {
  handle(formData: FormData): Promise<unknown>;
}
