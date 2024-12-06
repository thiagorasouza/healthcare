import { isAppwriteException } from "@/server/adapters/appwrite/helpers";
import { account } from "@/server/adapters/appwrite/nodeClient";
import { SessionModel } from "@/server/domain/models/sessionModel";
import { UsersRepositoryInterface } from "@/server/repositories/usersRepository";
import { Success } from "@/server/useCases/shared/core/success";
import { ServerFailure } from "@/server/useCases/shared/failures";
import { InvalidCredentialsFailure } from "@/server/useCases/shared/failures/invalidCredentialsFailure";
import { Models } from "node-appwrite";

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

  public mapSession(data: Models.Session): SessionModel {
    return {
      secret: data.secret,
      expire: data.expire,
    };
  }
}
