"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export function ErrorScreen({
  title,
  message,
  refresh = true,
}: {
  title: string;
  message: string;
  refresh?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-5xl font-bold">{title}</h1>
        <p className="text-lg leading-7">{message}</p>
        {refresh && (
          <Button className="flex w-fit" onClick={() => router.refresh()}>
            <RefreshCcw className="mr-1 h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
}
