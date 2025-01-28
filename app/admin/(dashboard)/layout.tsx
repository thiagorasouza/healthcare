import { AdminHeader } from "@/components/admin/AdminHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-[#FBFBFB]">
      <AdminHeader />
      <main className="mx-auto max-w-7xl p-4 md:px-8 md:py-6">{children}</main>
    </div>
  );
}
