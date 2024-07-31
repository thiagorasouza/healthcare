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
const BreadcrumbItemWithSeparator = ({ name, link }: { name: string; link: string }) => (
  <>
    <BreadcrumbItem>
      <BreadcrumbLink href={link} className="capitalize">
        {name === "admin" ? "Dashboard" : name}
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
          <BreadcrumbItemWithSeparator
            name={path}
            link={"/" + pathParts.slice(0, index + 1).join("/")}
            key={index}
          />
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
