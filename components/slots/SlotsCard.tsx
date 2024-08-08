import DefaultCard from "@/components/shared/DefaultCard";
import React from "react";

export default function SlotsCard({ children }: { children: React.ReactNode }) {
  return (
    <DefaultCard title="Current Slots" description="This doctor's available slots">
      {children}
    </DefaultCard>
  );
}
