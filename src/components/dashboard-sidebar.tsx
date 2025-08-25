

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  MessageSquare,
  Sparkles,
  User,
  Github,
  LogOut,
  Globe,
  UserPlus,
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Swipe' },
  { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
  {
    href: '/dashboard/recommendations',
    icon: Sparkles,
    label: 'AI Recommendations',
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const auth = getAuth(firebaseApp);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Icons.logo className="size-8 text-primary" />
          <span className="font-headline text-xl font-semibold">
            StackSwipe
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex flex-col gap-2">
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} variant="outline">
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
