import { expect, jest } from "@jest/globals";
import "./zodMock";
import { z, ZodError } from "zod";
import { loginSchema } from "./loginSchema";
import { loginAdmin } from "./loginAdmin";
import { invalidFieldsError } from "@/lib/results";

describe("loginAdmin", () => {
  it("returns an error for invalid fields", async () => {
    (loginSchema.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([]);
    });

    const userData = {
      email: "invalid_email@email.com",
      password: "invalid_password",
    };

    const result = await loginAdmin(userData);
    expect(result).toStrictEqual(invalidFieldsError());
  });
});
