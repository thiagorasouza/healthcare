import { expect, jest } from "@jest/globals";
import "./zodMock";
import "./cookiesMock";
import "./appwriteMock";
import { ZodError } from "zod";
import { loginSchema } from "./loginSchema";
import { loginAdmin } from "./loginAdmin";
import {
  invalidCredentialsError,
  invalidFieldsError,
  success,
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

  it("returns an error for invalid credentials", async () => {
    const createSessionSpy = jest.spyOn(account, "createEmailPasswordSession");

    createSessionSpy.mockImplementationOnce(() => {
      throw new AppwriteException("", 401, "user_invalid_credentials");
    });

    const result = await loginAdmin(mockUserData);
    expect(result).toStrictEqual(invalidCredentialsError());
  });

  it("returns unexpected error if appwrite throws", async () => {
    const createSessionSpy = jest.spyOn(account, "createEmailPasswordSession");

    createSessionSpy.mockImplementationOnce(() => {
      throw new AppwriteException("");
    });

    const result = await loginAdmin(mockUserData);

    expect(result).toStrictEqual(unexpectedError());
  });

  it("returns success for valid data", async () => {
    const result = await loginAdmin(mockUserData);
    expect(result).toStrictEqual(success());
  });
});
