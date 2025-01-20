import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

export function Component({ replace, backLink }: { replace?: string; backLink: string }) {
  return (
    <div className="flex items-center justify-between">
      <AdminBreadcrumb replace={replace} />
      <Button size="sm" variant="outline">
        <Link href={backLink} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
    </div>
  );
}

export const AdminBreadcrumbWithBackLink = memo(Component);
