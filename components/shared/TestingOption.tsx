import { Button } from "@/components/ui/button";
import { FlaskConicalIcon } from "lucide-react";

export function TestingOption({
  feature,
  onClick,
  className,
}: {
  feature: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">TESTING OPTION</span>
        </div>
      </div>
      <Button type="button" className="mb-6 w-full" onClick={onClick}>
        <FlaskConicalIcon className="mr-1 h-4 w-4" /> {feature}
      </Button>
      <div className="inset-0 flex items-center">
        <span className="w-full border-t"></span>
      </div>
    </div>
  );
}
