export interface UseCase {
  execute(request: unknown): Promise<unknown>;
}
