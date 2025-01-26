import { cn } from "@/lib/utils";
import Image from "next/image";

export function Landing({ onStartClick }: { onStartClick: () => void }) {
  return (
    <>
      <div className="flex items-center gap-3 md:hidden">
        <Image src="/img/logo-white.svg" alt="heartbeat logo" width={42} height={42} />
        <h2 className="text-2xl font-bold">Mednow</h2>
      </div>
      <div className="relative z-20 flex h-[800px] flex-col gap-8 px-8 py-4 pt-[17vh] text-center md:items-start md:justify-center md:gap-10 md:px-16 md:py-8 md:pl-28 md:pt-0 md:text-left">
        <h1 className="text-[52px] font-semibold leading-[1.2] text-black md:text-6xl">
          Medical &<br /> Healthcare
          <br /> <span className="">Services</span>
        </h1>
        <p className="font-medium text-gray">
          Online consultations with certified
          <br /> medical professionals
        </p>
        <div className="mx-auto mt-10 md:m-0">
          <button
            className="group flex h-[60px] items-center gap-[9px] rounded-full bg-darker-purple p-[5px] focus:outline-none"
            onClick={onStartClick}
          >
            <div
              className={cn(
                "flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white",
                "transition-all duration-500 group-hover:translate-x-[202px]",
              )}
            >
              <Image
                src="/img/arrow.svg"
                alt="user icon"
                width={18}
                height={18}
                className="mt-[1px] text-white"
              />
            </div>
            <span
              className={cn(
                "group-hover:tran mr-[27px] text-[17px] font-medium text-white",
                "transition-all duration-500 group-hover:-translate-x-[40px]",
              )}
            >
              Book An Appointment
            </span>
          </button>
        </div>
      </div>
      <Image
        src="/img/side.png"
        alt="Doctor"
        width={1418}
        height={2048}
        //   className="absolute bottom-0 top-0 z-10 h-full max-h-full object-contain object-right"
        className="absolute bottom-0 right-0 top-0 z-10 hidden h-full max-h-full w-fit md:block"
      />
    </>
  );
}
