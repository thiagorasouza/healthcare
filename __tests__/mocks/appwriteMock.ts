import { sessionMock } from "@/__tests__/mocks/sessionMock";
import { jest } from "@jest/globals";

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
