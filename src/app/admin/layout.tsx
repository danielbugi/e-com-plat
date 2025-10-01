import { AdminSidebar } from "../../components/admin/admin-sidebar";
import { AdminHeader } from "../../components/admin/admin-header";
import { SettingsProvider } from "@/contexts/settings-context";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Uncomment when auth is fully setup
  // const session = await getServerSession(authOptions)
  // if (!session || session.user.role !== 'ADMIN') {
  //   redirect('/')
  // }

  // Temporary mock user for development
  const mockUser = {
    name: "Admin User",
    email: "admin@forgesteel.com",
    image: null,
  };

  return (
    <SettingsProvider>
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader user={mockUser} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SettingsProvider>
  );
}
