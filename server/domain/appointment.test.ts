import { MIN_ADVANCE, MIN_DURATION } from "@/server/config/constants";
import { Appointment } from "@/server/domain/appointment";
import { mockAppointment } from "@/server/domain/mocks/appointment.mock";
import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { AppointmentTooShortFailure } from "@/server/shared/failures/appointmentTooShortFailure";
import { AppointmentTooSoonFailure } from "@/server/shared/failures/appointmentTooSoonFailure";
import { AppointmentLogicSuccess } from "@/server/shared/successes";
import { expect } from "@jest/globals";
import { addMinutes, set } from "date-fns";

const makeSut = (appointment: AppointmentModel) => {
  return new Appointment(appointment);
};

describe("Appointment Entity Test Suite", () => {
  it("validate should fail if appointment is too soon", () => {
    const startTime = addMinutes(new Date(), MIN_ADVANCE - 5);
    const duration = MIN_DURATION;

    const appointmentMock = mockAppointment(startTime, duration);
    const sut = makeSut(appointmentMock);

    expect(sut.validate()).toStrictEqual(new AppointmentTooSoonFailure(startTime));
  });

  it("validate should return false if appointment is too short", () => {
    const startTime = addMinutes(new Date(), MIN_ADVANCE);
    const duration = MIN_DURATION - 5;

    const appointmentMock = mockAppointment(startTime, duration);
    const sut = makeSut(appointmentMock);

    expect(sut.validate()).toStrictEqual(new AppointmentTooShortFailure(duration));
  });

  it("validate should return true if appointment is valid", () => {
    const startTime = addMinutes(new Date(), MIN_ADVANCE + 5);
    const duration = MIN_DURATION;

    const appointmentMock = mockAppointment(startTime, duration);
    const sut = makeSut(appointmentMock);

    expect(sut.validate()).toStrictEqual(new AppointmentLogicSuccess(sut));
  });

  it("isConflicting should return false if appointments conflict", () => {
    const day = new Date("2024-01-01T05:00:00.000Z");
    const appointmentMock1 = mockAppointment(set(day, { hours: 10, minutes: 30 }), 30);
    const appointmentMock2 = mockAppointment(set(day, { hours: 10, minutes: 45 }), 30);

    const sut = makeSut(appointmentMock1);

    expect(sut.isConflicting(appointmentMock2)).toBe(true);
  });

  it("isConflicting should return true if appointments do not conflict", () => {
    const day = new Date("2024-01-01T05:00:00.000Z");
    const appointmentMock1 = mockAppointment(set(day, { hours: 10, minutes: 30 }), 30);
    const appointmentMock2 = mockAppointment(set(day, { hours: 11, minutes: 0 }), 30);

    const sut = makeSut(appointmentMock1);

    expect(sut.isConflicting(appointmentMock2)).toBe(false);
  });
});
