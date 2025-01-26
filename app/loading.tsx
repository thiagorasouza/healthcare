import { cn } from "@/lib/utils";
import "animate.css";
import Image from "next/image";

export default function LoadingPage({ fullScreen = true }: { fullScreen?: boolean }) {
  return (
    <div
      className={cn(
        "animate__animated animate__pulse animate__infinite flex w-full items-center justify-center gap-4",
        fullScreen ? "min-h-[calc(100vh-100px)]" : "min-h-[calc(100vh-50px)]",
      )}
    >
      <Image src="/img/logo-white.svg" alt="heartbeat logo" width={52} height={52} />
      <h1 className="text-3xl font-semibold">Mednow</h1>
    </div>
  );
}
