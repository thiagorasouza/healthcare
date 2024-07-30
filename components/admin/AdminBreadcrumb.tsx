"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const AdminBreadcrumb = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const isLastPathAndId = !/^[a-zA-Z]+$/.test(pathParts[pathParts.length - 1]);
  if (isLastPathAndId) {
    pathParts.pop();
  }
  const lastPath = pathParts.pop();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathParts.map((path, index) => {
          return (
            <>
              <BreadcrumbItem key={index}>
                <BreadcrumbLink href="#" className="capitalize">
                  {path === "admin" ? "Dashboard" : path}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          );
        })}
        <BreadcrumbPage className="capitalize">{lastPath}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AdminBreadcrumb;
