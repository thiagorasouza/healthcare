"use client";

import { DoctorsCarousel } from "@/components/appointments/DoctorsCarousel";
import { DoctorModel } from "@/server/domain/models/doctorModel";

interface DoctorSelectorProps {
  doctors: DoctorModel[];
  doctor?: DoctorModel;
  onDoctorClick: (doctor: DoctorModel) => unknown;
}

export function DoctorSelector({ doctors, doctor, onDoctorClick }: DoctorSelectorProps) {
  return (
    <div className="flex flex-col gap-12">
      <section className="text-center">
        <h1 className="mb-2 text-2xl font-bold">
          Let&apos;s find your <span className="text-yellow">top doctor</span>
        </h1>
        <p className="font-medium text-gray">Choose a doctor to see his or her available hours</p>
      </section>

      <DoctorsCarousel doctors={doctors} doctor={doctor} onDoctorClick={onDoctorClick} />
    </div>
  );
}
