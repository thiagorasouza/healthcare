import { jest } from "@jest/globals";
import { sessionMock } from "./sessionMock";

jest.mock("node-appwrite", () => {
  const actual = jest.requireActual("node-appwrite") as any;
  return {
    __esModule: true,
    ...actual,
    Account: jest.fn(() => ({
      createEmailPasswordSession: jest.fn(() => Promise.resolve(sessionMock)),
    })),
  };
});
