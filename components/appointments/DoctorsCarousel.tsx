import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getImageLink } from "@/lib/actions/getImageLink";
import { cn, colorize, getFirstName } from "@/lib/utils";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import Image from "next/image";

interface DoctorCarouselProps {
  doctors: DoctorModel[];
  onDoctorClick: (doctor: DoctorModel) => unknown;
}

export function DoctorsCarousel({ doctors, onDoctorClick }: DoctorCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        slidesToScroll: 3,
        duration: 35,
      }}
      className="mx-auto w-[1100px]"
    >
      <CarouselContent>
        {doctors.map((doctor, index) => (
          <CarouselItem key={index} className="basis-1/4">
            <DoctorCard index={index} doctor={doctor} onDoctorClick={onDoctorClick} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

interface DoctorCardProps {
  index: number;
  doctor: DoctorModel;
  onDoctorClick: (doctor: DoctorModel) => unknown;
}

function DoctorCard({ index, doctor, onDoctorClick }: DoctorCardProps) {
  const picture = getImageLink(doctor.pictureId);
  const bgColor = colorize(index);

  return (
    <div className="relative h-[300px] pt-[28px]">
      <div
        className={cn(
          "relative mx-auto h-[234px] w-[236px] cursor-pointer rounded-[60px] transition hover:scale-105",
          bgColor,
        )}
        onClick={() => onDoctorClick(doctor)}
      >
        <Image
          src={picture}
          alt="doctor picture"
          width={472}
          height={524}
          className="absolute -top-[28px] left-0 right-0"
        />
        <div className={bgColor}></div>
        <div className="absolute -bottom-[26px] left-[13px] right-[13px] flex h-[70px] items-center gap-3 rounded-[20px] bg-white px-[22px] py-[17px] shadow">
          <div className="font-semibold">
            <h3 className="text-md">Dr. {getFirstName(doctor.name)}</h3>
            <p className="text-xs text-gray">{doctor.specialty}</p>
          </div>
          <Image
            src="/icons/arrow-icon.svg"
            alt="Right arrow with circle icon"
            width={31}
            height={31}
            className="ml-auto"
          />
        </div>
      </div>
    </div>
  );
}
