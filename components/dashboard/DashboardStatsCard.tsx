"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ElementType } from "react";

interface DashboardCardProps {
  title: string;
  stats: string;
  growth: string;
  Icon: ElementType;
  href: string;
}

export default function DashboardStatsCard({
  title,
  stats,
  growth,
  Icon,
  href,
}: DashboardCardProps) {
  const router = useRouter();

  return (
    <Link href={href} target="_blank">
      <Card className="group flex overflow-hidden hover:cursor-pointer">
        <div className="flex-1">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats}</div>
            <p className="text-xs text-muted-foreground">{growth}</p>
          </CardContent>
        </div>
        <div className="ml-auto flex items-center self-stretch bg-muted px-1 transition-all group-hover:px-3">
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </Card>
    </Link>
  );
}
