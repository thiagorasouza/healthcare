import { DoctorCard } from "@/components/appointments/create/DoctorCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { DoctorModel } from "@/server/domain/models/doctorModel";

interface DoctorCarouselProps {
  doctors: DoctorModel[];
  doctor?: DoctorModel;
  onDoctorClick: (doctor: DoctorModel) => unknown;
}

export function DoctorsCarousel({
  doctors,
  doctor: pickedDoctor,
  onDoctorClick,
}: DoctorCarouselProps) {
  return (
    <Carousel opts={{ loop: true, align: "start", slidesToScroll: "auto", duration: 35 }}>
      <CarouselPrevious />
      <CarouselContent>
        {doctors.map((doctor, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <DoctorCard
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
