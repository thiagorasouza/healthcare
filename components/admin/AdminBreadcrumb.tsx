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

// Necessary due to key={} errors when using empty JSX tag
const BreadcrumbItemWithSeparator = ({ path }: { path: string }) => (
  <>
    <BreadcrumbItem>
      <BreadcrumbLink href="#" className="capitalize">
        {path === "admin" ? "Dashboard" : path}
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
  </>
);

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
        {pathParts.map((path, index) => (
          <BreadcrumbItemWithSeparator path={path} key={index} />
        ))}
        <BreadcrumbItem key="page">
          <BreadcrumbPage key="page" className="capitalize">
            {lastPath}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AdminBreadcrumb;
