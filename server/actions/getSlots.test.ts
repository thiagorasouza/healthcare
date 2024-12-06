import { getSlots } from "@/server/actions/getSlots";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { describe, expect, it } from "@jest/globals";

const mockRequest = () => {
  const formData = objectToFormData({
    doctorId: "66dde944003742946798",
    startDate: new Date(),
  });

  return formData;
};

describe("GetSlots Test Suite", () => {
  it("should not throw", async () => {
    const request = mockRequest();
    await expect(getSlots(request)).resolves.not.toThrow();
  });
});
