import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HomeIcon } from "@radix-ui/react-icons";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex">
      <div className="relative flex min-h-screen flex-1 flex-col items-center justify-center p-8">
        <Button variant="ghost" className="absolute left-0 top-0 ml-8 mt-6 text-sm">
          <Link href="/" className="flex items-center">
            <HomeIcon className="mr-2 h-4 w-4" /> Home
          </Link>
        </Button>
        <section className="w-full max-w-[400px] space-y-6">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">to the admin dashboard</p>
          </div>
          <LoginForm />
        </section>
      </div>
      <aside className="relative hidden min-h-screen flex-1 bg-zinc-900 lg:block">
        <h1 className="absolute right-0 top-0 m-8 text-lg font-semibold text-white">Mednow</h1>
        <Image
          src="/img/login-side.png"
          alt="hospital building"
          width={720}
          height={1080}
          className="h-screen w-full object-cover brightness-[0.2] grayscale"
        />
      </aside>
    </main>
  );
}
