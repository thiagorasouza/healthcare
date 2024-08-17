import DefaultCard from "@/components/shared/DefaultCard";
import React from "react";

export default function SlotsCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DefaultCard title="Slots" description="Click a slot to edit or delete" className={className}>
      {children}
    </DefaultCard>
  );
}
