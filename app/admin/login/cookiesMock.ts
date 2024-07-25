import { jest } from "@jest/globals";

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(() => {
      console.log("Set called");
    }),
  })),
}));
