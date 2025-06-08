"use client";

import { setTourState } from "@/lib/actions/localStorage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useNextStep } from "nextstepjs";

export default function RestartTour() {
  const router = useRouter();
  const { isNextStepVisible } = useNextStep();

  const onRestartClick = () => {
    setTourState("show");
    window.location.reload();
  };

  if (isNextStepVisible) {
    return null;
  }

  return (
    <div
      className="group fixed bottom-10 right-14 z-30 flex cursor-pointer items-center rounded-full bg-black p-4 text-white shadow-md transition-all"
      onClick={onRestartClick}
    >
      <Image quality={100} src="/img/restart-tour.svg" width="24" height="24" alt="Restart tour" />
      <p className="invisible max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:visible group-hover:ml-2 group-hover:max-w-[200px] group-hover:opacity-100">
        Refresh & Restart Tour
      </p>
    </div>
  );
}
