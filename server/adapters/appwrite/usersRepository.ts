import { isAppwriteException } from "@/server/adapters/appwrite/helpers";
import { account, client, Models } from "@/server/adapters/appwrite/nodeClient";
import { client as webClient } from "@/server/adapters/appwrite/webClient";
import { SessionModel } from "@/server/domain/models/sessionModel";
import { UsersRepositoryInterface } from "@/server/repositories/usersRepository";
import { Success } from "@/server/useCases/shared/core/success";
import { ServerFailure } from "@/server/useCases/shared/failures";
import { InvalidCredentialsFailure } from "@/server/useCases/shared/failures/invalidCredentialsFailure";
import { Account } from "appwrite";
import { cookies } from "next/headers";

export class UsersRepository implements UsersRepositoryInterface {
  public async login(email: string, password: string) {
    try {
      const result = (await account.createEmailPasswordSession(email, password)) as Models.Session;

      return new Success(this.mapSession(result));
    } catch (error) {
      console.log(error);

      if (isAppwriteException(error)) {
        if (error.type === "user_invalid_credentials") {
          return new InvalidCredentialsFailure();
        }
      }

      return new ServerFailure("Appwrite error");
    }
  }

  public async logout() {
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("session");
      if (sessionCookie) {
        await webClient.setSession(sessionCookie.value);
        await new Account(webClient).deleteSession("current");
      }
      return new Success("Logged out");
    } catch (error) {
      console.log(error);
      return new ServerFailure("Server error");
    }
  }

  public mapSession(data: Models.Session): SessionModel {
    return {
      secret: data.secret,
      expire: data.expire,
    };
  }
}
