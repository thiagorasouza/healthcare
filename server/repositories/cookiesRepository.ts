import { SessionModel } from "@/server/domain/models/sessionModel";

export interface CookiesRepositoryInterface {
  set(session: SessionModel): Promise<void>;
}
