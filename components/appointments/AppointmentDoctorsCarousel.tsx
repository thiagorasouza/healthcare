import { AppointmentDoctorCard } from "@/components/appointments/AppointmentDoctorCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { DoctorModel } from "@/server/domain/models/doctorModel";

interface AppointmentDoctorCarouselProps {
  doctors: DoctorModel[];
  doctor?: DoctorModel;
  onDoctorClick: (doctor: DoctorModel) => unknown;
}

export function AppointmentDoctorsCarousel({
  doctors,
  doctor: pickedDoctor,
  onDoctorClick,
}: AppointmentDoctorCarouselProps) {
  return (
    <Carousel opts={{ loop: true, align: "start", slidesToScroll: "auto", duration: 35 }}>
      <CarouselPrevious />
      <CarouselContent>
        {doctors.map((doctor, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 2xl:basis-1/4">
            <AppointmentDoctorCard
              colorIndex={index}
              doctor={doctor}
              active={!!pickedDoctor && doctor.id === pickedDoctor.id}
              muted={!!pickedDoctor && doctor.id !== pickedDoctor.id}
              onDoctorClick={onDoctorClick}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
}
