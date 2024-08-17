import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";

interface DefaultCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  onCloseClick?: () => void;
}

export default function DefaultCard({
  title,
  description,
  children,
  className,
  onCloseClick,
}: DefaultCardProps) {
  return (
    <Card className={cn("shadow", className)}>
      <CardHeader>
        {onCloseClick ? (
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="cursor-pointer p-3" onClick={onCloseClick}>
              <X className="h-4 w-4" />
            </div>
          </div>
        ) : (
          <>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
