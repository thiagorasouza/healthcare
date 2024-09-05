import { cn } from "@/lib/utils";
import Image from "next/image";

export default function DoctorChooseCard({
  doctor,
}: {
  doctor: {
    name: string;
    specialty: string;
    picture: string;
    bgColor: string;
  };
}) {
  return (
    <div className={cn("relative h-[234px] w-[236px] rounded-[60px]", doctor.bgColor)}>
      <Image
        src={doctor.picture}
        alt="female doctor"
        width={472}
        height={524}
        className="absolute -top-[28px] left-0 right-0"
      />
      <div className="absolute -bottom-[26px] left-[13px] right-[13px] flex h-[70px] items-center gap-3 rounded-[20px] bg-white px-[22px] py-[17px] shadow">
        <div className="font-semibold">
          <h3 className="text-md">{doctor.name}</h3>
          <p className="text-gray] text-xs">{doctor.specialty}</p>
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
  );
}
