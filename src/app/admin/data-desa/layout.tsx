import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "Edit Data Desa | Admin Desa Timbukar",
  description:
    "Halaman untuk mengedit data statistik dan demografis Desa Timbukar",
};

export default function AdminDataDesaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-0 pt-20 md:pt-0 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
