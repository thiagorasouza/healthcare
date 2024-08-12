import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerOff } from "lucide-react";

export default function ErrorCard({ text }: { text: string }) {
  return (
    <Card className={"shadow"}>
      <CardContent className="flex items-center pt-6">
        <ServerOff className="mr-3 h-5 w-5 text-destructive" />
        {text}
      </CardContent>
    </Card>
  );
}
