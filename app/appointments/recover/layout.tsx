import { ReactNode } from "react";

export default function VisitorLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-7xl p-4 md:p-8">{children}</div>;
}
