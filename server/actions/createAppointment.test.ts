// HITS THE API

import { objectToFormData } from "@/lib/utils";
import { createAppointment } from "@/server/actions/createAppointment";
import { mockAppointment } from "@/server/domain/mocks/appointment.mock";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { faker } from "@faker-js/faker";
import { describe, expect, it } from "@jest/globals";
import { addDays } from "date-fns";

const mockRequest = () => {
  const formData = objectToFormData({
    doctorId: "66dde944003742946798",
    patientId: "66e1e887000617cec5d3",
    startTime: new Date("2024-10-30T14:59:00.000Z"),
    duration: 30,
  } as AppointmentModel);

  return formData;
};

describe("CreateAppointment Action Test Suite", () => {
  it("should not throw before calling the controller", async () => {
    const requestMock = mockRequest();
    await expect(createAppointment(requestMock)).resolves.not.toThrow();
  });
});
