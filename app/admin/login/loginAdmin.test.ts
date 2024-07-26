import { expect, jest } from "@jest/globals";
import "./zodMock";
import "./cookiesMock";
import "./appwriteMock";
import { ZodError } from "zod";
import { loginSchema } from "./loginSchema";

import {
  invalidCredentialsError,
  invalidFieldsError,
  success,
  unexpectedError,
} from "@/lib/results";
import { account, AppwriteException } from "@/lib/appwrite/adminClient";
import { cookies } from "next/headers";
import { sessionMock } from "./sessionMock";
import { loginAdmin } from "./loginAdmin";

const mockUserData = (() => {
  const formData = new FormData();
  formData.append("email", "john@email.com");
  formData.append("password", "abc123");
  return formData;
})();

const initialState = {
  message: "",
};

describe("loginAdmin", () => {
  it("returns an error for invalid fields", async () => {
    jest.spyOn(loginSchema, "parse").mockImplementationOnce(() => {
      throw new ZodError([]);
    });

    const result = await loginAdmin(initialState, mockUserData);
    expect(result).toStrictEqual(invalidFieldsError());
  });

  it("returns an error for invalid credentials", async () => {
    jest
      .spyOn(account, "createEmailPasswordSession")
      .mockImplementationOnce(() => {
        throw new AppwriteException("", 401, "user_invalid_credentials");
      });

    const result = await loginAdmin(initialState, mockUserData);
    expect(result).toStrictEqual(invalidCredentialsError());
  });

  it("returns unexpected error if appwrite throws", async () => {
    jest
      .spyOn(account, "createEmailPasswordSession")
      .mockImplementationOnce(() => {
        throw new AppwriteException("");
      });

    const result = await loginAdmin(initialState, mockUserData);

    expect(result).toStrictEqual(unexpectedError());
  });

  it("sets cookie with the session secret", async () => {
    const cookiesMock = { set: jest.fn() };
    // @ts-ignore
    cookies.mockImplementationOnce(() => cookiesMock);

    const result = await loginAdmin(initialState, mockUserData);
    // console.log("🚀 ~ result:", result);

    expect(cookiesMock.set).toHaveBeenCalledWith(
      "session",
      sessionMock.secret,
      {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: Number(sessionMock.expire),
        path: "/",
      },
    );
  });

  it("returns success for valid data", async () => {
    const result = await loginAdmin(initialState, mockUserData);
    expect(result).toStrictEqual(success());
  });
});
