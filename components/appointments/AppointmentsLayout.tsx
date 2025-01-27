import Image from "next/image";
import { ReactNode } from "react";

export function AppointmentsLayout({ nav, main }: { nav: ReactNode; main: ReactNode }) {
  return (
    <div className="min-h-screen w-full md:bg-[#212121]">
      <div className="mx-auto flex max-w-[1580px] flex-1 justify-center gap-10 p-3">
        <aside className="hidden flex-shrink-0 flex-col py-4 xl:flex">
          <header className="mb-8 flex items-center gap-2 px-4">
            <Image
              src="/img/logo-dark.svg"
              alt="heartbeat logo"
              width={42}
              height={42}
              className="hidden md:block"
            />
            <h2 className="text-2xl font-medium text-white">Mednow</h2>
          </header>
          <nav>{nav}</nav>
        </aside>
        <main className="relative w-full overflow-hidden rounded-3xl bg-white p-2 md:px-3 lg:px-6 xl:w-[80%]">
          {main}
        </main>
      </div>
    </div>
  );
}
