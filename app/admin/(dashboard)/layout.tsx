import { AdminHeader } from "@/components/admin/AdminHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#FBFBFB]">
      <AdminHeader />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-6 md:p-6">
        {children}
      </main>
    </div>
  );
}
