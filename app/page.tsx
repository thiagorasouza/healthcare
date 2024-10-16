import { Button } from "@/components/ui/button";
import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold tracking-tighter">Mednow</h1>
      <p className="text-sm">
        Under construction by{" "}
        <Link href="https://github.com/thiagorasouza" className="underline">
          @thiagorasouza
        </Link>
      </p>
      <nav className="mt-2">
        <ul>
          <li>
            <Button variant="outline" className="shadow" asChild>
              <Link href="/admin/login" className="flex items-center">
                <PersonIcon className="mr-2 h-4 w-4" /> Dashboard
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </main>
  );
}
