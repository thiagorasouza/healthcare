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

  const description = name === replace ? replacement : name;

  return (
    <>
      <BreadcrumbItem className="hidden md:block">
        <BreadcrumbLink href={link} className="capitalize">
          {description}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator className="hidden md:block" />
    </>
  );
};

export function AdminBreadcrumb({ replace, replacement }: AdminBreadCrumbProps) {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const isLastPathAndId = !/^[a-zA-Z]+$/.test(pathParts[pathParts.length - 1]);
  if (isLastPathAndId) {
    pathParts.pop();
  }
  const lastPath = pathParts.pop();

  return (
    <Breadcrumb className="flex min-h-[36px] items-center">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin" className="capitalize">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathParts.slice(1).map((path, index) => (
          <BreadcrumbItemWithSeparator
            name={path}
            link={"/" + pathParts.slice(0, index + 2).join("/")}
            replace={replace}
            replacement={replacement}
            key={index}
          />
        ))}
        {/* Show only on mobile */}
        <BreadcrumbItem className="md:hidden">...</BreadcrumbItem>
        <BreadcrumbSeparator className="md:hidden" />

        <BreadcrumbItem key="page">
          <BreadcrumbPage key="page" className="capitalize">
            {lastPath}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
