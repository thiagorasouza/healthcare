import { expect, jest } from "@jest/globals";
import "./zodMock";
import { ZodError } from "zod";
import { loginSchema } from "./loginSchema";
import { loginAdmin } from "./loginAdmin";
import {
  invalidCredentialsError,
  invalidFieldsError,
  unexpectedError,
} from "@/lib/results";
import { account, AppwriteException } from "@/lib/appwrite/adminClient";

const mockUserData = {
  email: "john@email.com",
  password: "abcd1234",
};

describe("loginAdmin", () => {
  it("returns an error for invalid fields", async () => {
    (loginSchema.parse as jest.Mock).mockImplementationOnce(() => {
      throw new ZodError([]);
    });

    const result = await loginAdmin(mockUserData);
    expect(result).toStrictEqual(invalidFieldsError());
  });

  it("return an error for invalid credentials", async () => {
    const createSessionSpy = jest.spyOn(account, "createEmailPasswordSession");

    createSessionSpy.mockImplementation(() => {
      throw new AppwriteException("", 401, "user_invalid_credentials");
    });

    const result = await loginAdmin(mockUserData);
    expect(result).toStrictEqual(invalidCredentialsError());
  });

  it("return unexpected error if appwrite throws", async () => {
    const createSessionSpy = jest.spyOn(account, "createEmailPasswordSession");

    createSessionSpy.mockImplementation(() => {
      throw new AppwriteException("");
    });

    const result = await loginAdmin(mockUserData);
    expect(result).toStrictEqual(unexpectedError());
  });
});
