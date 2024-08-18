import { AdminHeader } from "@/components/admin/AdminHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#FBFBFB]">
      <AdminHeader />
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
