import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
  label,
  onBackClick,
}: {
  label?: string;
  onBackClick: () => void;
}) {
  return (
    <Button variant="outline" className="flex items-center" onClick={onBackClick}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label ?? "Back"}
    </Button>
  );
}
