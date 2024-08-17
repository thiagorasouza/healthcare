import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ServerOff } from "lucide-react";

export default function ErrorCard({ text, className }: { text: string; className?: string }) {
  return (
    <Card className={cn("shadow", className)}>
      <CardContent className="flex items-center pt-6">
        <ServerOff className="mr-3 h-5 w-5 text-destructive" />
        {text}
      </CardContent>
    </Card>
  );
}
