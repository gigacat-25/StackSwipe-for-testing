
'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { UserProvider } from '@/hooks/use-user';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <div className="min-h-screen">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
