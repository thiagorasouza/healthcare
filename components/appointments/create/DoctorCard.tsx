import { getImageLink } from "@/lib/actions/getImageLink";
import { cn, colorize, getFirstName } from "@/lib/utils";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";

interface DoctorCardProps {
  colorIndex: number;
  doctor: Pick<DoctorModel, "name" | "specialty" | "pictureId">;
  muted?: boolean;
  active?: boolean;
  fixed?: boolean;
  className?: string;
  onDoctorClick?: (doctor: DoctorModel) => unknown;
}

export function DoctorCard({
  colorIndex,
  doctor,
  active,
  muted,
  fixed,
  className,
  onDoctorClick,
}: DoctorCardProps) {
  const picture = getImageLink(doctor.pictureId);
  const bgColor = colorize(colorIndex);

  return (
    <div
      className={cn(
        "relative h-[298px] w-full py-[28px]",
        { "grayscale hover:grayscale-0": muted },
        className,
      )}
    >
      <div
        className={cn(
          "relative mx-auto h-[234px] w-[236px] rounded-[60px] transition",
          { "scale-105": active },
          { "cursor-pointer hover:scale-105": !fixed },
          bgColor,
        )}
        // @ts-ignore
        onClick={() => onDoctorClick && onDoctorClick(doctor)}
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
            <h3>Dr. {getFirstName(doctor.name)}</h3>
            <p className="text-xs text-gray">{doctor.specialty}</p>
          </div>
          {fixed ? (
            <CircleCheckBig className="ml-auto h-7 w-7 text-dark-purple" />
          ) : (
            <Image
              src="/icons/arrow-icon.svg"
              alt="Right arrow with circle icon"
              width={31}
              height={31}
              className="ml-auto"
            />
          )}
        </div>
      </div>
    </div>
  );
}
