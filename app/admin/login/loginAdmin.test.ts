import { expect, jest } from "@jest/globals";
import "./zodMock";
import { ZodError } from "zod";
import { loginSchema } from "./loginSchema";
import { loginAdmin } from "./loginAdmin";
import { invalidCredentialsError, invalidFieldsError } from "@/lib/results";
import { account, AppwriteException } from "@/lib/appwrite/adminClient";

describe("loginAdmin", () => {
  it("returns an error for invalid fields", async () => {
    (loginSchema.parse as jest.Mock).mockImplementationOnce(() => {
      throw new ZodError([]);
    });

    const userData = {
      email: "invalid_email@email.com",
      password: "invalid_password",
    };

    const result = await loginAdmin(userData);
    expect(result).toStrictEqual(invalidFieldsError());
  });

  it("return an error for invalid credentials", async () => {
    const createSessionSpy = jest.spyOn(account, "createEmailPasswordSession");

    createSessionSpy.mockImplementation(() => {
      throw new AppwriteException("", 401, "user_invalid_credentials");
    });

    const userData = {
      email: "invalid_credential@email.com",
      password: "invalid_credential",
    };

    const result = await loginAdmin(userData);
    expect(result).toStrictEqual(invalidCredentialsError());
  });
});
