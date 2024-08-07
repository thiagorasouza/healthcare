import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface DefaultCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function DefaultCard({ title, description, children }: DefaultCardProps) {
  return (
    <Card className="shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
