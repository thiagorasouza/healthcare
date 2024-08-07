import DefaultCard from "@/components/availabilities/DefaultCard";
import React from "react";

export default function AvailabilitiesCard({ children }: { children: React.ReactNode }) {
  return (
    <DefaultCard title="Available Hours" description="This doctor's available hours">
      {children}
    </DefaultCard>
  );
}
