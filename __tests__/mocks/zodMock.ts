import { jest } from "@jest/globals";
jest.mock("zod", () => {
  const actualZod = jest.requireActual("zod") as any;
  return {
    ...actualZod,
    __esModule: true,
    z: {
      ...actualZod.z,
      object: jest.fn().mockImplementation(() => ({
        parse: jest.fn((data) => data),
      })),
    },
  };
});
