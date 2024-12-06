import { SessionModel } from "@/server/domain/models/sessionModel";
import { CookiesRepositoryInterface } from "@/server/repositories/cookiesRepository";
import { cookies } from "next/headers";

export class CookiesRepository implements CookiesRepositoryInterface {
  public async set(session: SessionModel): Promise<void> {
    const cookiesStore = await cookies();
    cookiesStore.set("session", session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: Number(session.expire),
      path: "/",
    });
  }
}
