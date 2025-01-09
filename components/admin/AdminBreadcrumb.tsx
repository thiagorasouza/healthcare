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

interface AdminBreadCrumbProps {
  replace?: string;
  replacement?: string;
}

type BreadcrumbItemProps = {
  name: string;
  link: string;
} & AdminBreadCrumbProps;

// Necessary due to key={} errors when using empty JSX tag
const BreadcrumbItemWithSeparator = ({ name, link, replace, replacement }: BreadcrumbItemProps) => {
  if (name === replace && !replacement) {
    return null;
  }

  const description = name === "admin" ? "Dashboard" : name === replace ? replacement : name;

  return (
    <>
      <BreadcrumbItem>
        <BreadcrumbLink href={link} className="capitalize">
          {description}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </>
  );
};

export default function AdminBreadcrumb({ replace, replacement }: AdminBreadCrumbProps) {
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
            replace={replace}
            replacement={replacement}
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
}
