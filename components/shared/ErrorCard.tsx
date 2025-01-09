"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RefreshCcw, ServerOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorCard({
  text,
  className,
  refresh = false,
}: {
  text: string;
  className?: string;
  refresh?: boolean;
}) {
  const router = useRouter();

  return (
    <Card className={cn("shadow", className)}>
      <CardContent className="flex flex-col gap-4 pt-6">
        <div className="flex items-center">
          <ServerOff className="mr-3 h-5 w-5 text-destructive" />
          {text}
        </div>
        <Button size="sm" variant="outline" className="flex w-fit" onClick={() => router.refresh()}>
          <RefreshCcw className="mr-1 h-4 w-4" />
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
