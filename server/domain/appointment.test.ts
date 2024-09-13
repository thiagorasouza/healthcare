import { MIN_ADVANCE, MIN_DURATION } from "@/server/config/constants";
import { Appointment } from "@/server/domain/appointment";
import { mockAppointment } from "@/server/domain/mocks/appointment.mock";
import { expect } from "@jest/globals";
import { addMinutes } from "date-fns";

describe("Appointment Entity Test Suite", () => {
  it("isValid should return false if appointment is too soon", () => {
    const startTime = addMinutes(new Date(), MIN_ADVANCE - 5);
    const duration = MIN_DURATION;
    const appointmentMock = mockAppointment(startTime, duration);
    const appointment = new Appointment(appointmentMock);
    expect(appointment.isValid()).toBe(false);
  });

  it("isValid should return false if appointment is too short", () => {
    const startTime = addMinutes(new Date(), MIN_ADVANCE);
    const duration = MIN_DURATION - 5;
    const appointmentMock = mockAppointment(startTime, duration);
    const appointment = new Appointment(appointmentMock);
    expect(appointment.isValid()).toBe(false);
  });

  it("isValid should return true if appointment is valid", () => {
    const startTime = addMinutes(new Date(), MIN_ADVANCE + 5);
    const duration = MIN_DURATION;
    const appointmentMock = mockAppointment(startTime, duration);
    const appointment = new Appointment(appointmentMock);
    expect(appointment.isValid()).toBe(true);
  });
});
