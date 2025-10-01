import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { AdminUsersManagement } from "@/components/admin/admin-users-management";
import { SystemInfo } from "@/components/admin/system-info";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings and configuration
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Admin Users</TabsTrigger>
          <TabsTrigger value="system">System Info</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <SiteSettingsForm />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsersManagement />
        </TabsContent>

        <TabsContent value="system">
          <SystemInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
}
