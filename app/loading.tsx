import "animate.css";
import Image from "next/image";

export default function LoadingPage() {
  return (
    <div className="animate__animated animate__pulse animate__infinite -ml-4 -mt-4 flex min-h-screen w-full items-center justify-center gap-4">
      <div className="">
        <Image src="/img/logo-white.svg" alt="heartbeat logo" width={52} height={52} />
      </div>
      <h1 className="text-3xl font-semibold">Mednow</h1>
    </div>
  );
}
