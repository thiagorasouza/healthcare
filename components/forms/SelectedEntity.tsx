import { ArrowUpRight, ArrowUpRightFromSquare, UserIcon } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

// Memoizeds
function Component({ link, text }: { link: string; text: string }) {
  return (
    <div className="border-1 flex w-full items-center gap-2 rounded-md border border-input bg-accent p-3 text-sm">
      <UserIcon className="h-4 w-4" />
      <p>{text}</p>
      <Link
        href={link}
        target="_blank"
        className="group ml-auto flex cursor-pointer items-center gap-2 pt-[2px]"
      >
        <p className="hidden text-xs uppercase md:block">VIEW</p>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export const SelectedEntity = memo(Component);
