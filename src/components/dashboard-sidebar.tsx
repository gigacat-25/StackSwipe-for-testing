
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
import { useUser } from '@/hooks/use-user';
import { ThemeToggle } from './theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';


const menuItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Swipe' },
  { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
  {
    href: '/dashboard/recommendations',
    icon: Sparkles,
    label: 'AI Recommendations',
  },
  { href: '/dashboard/profile/edit', icon: User, label: 'My Profile' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user: currentUser } = useUser();

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
                isActive={pathname === item.href}
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
            <div className="flex items-center gap-3 p-2">
                <Avatar>
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold truncate">{currentUser.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{currentUser.headline}</span>
                </div>
                 <div className="flex items-center gap-1">
                    <ThemeToggle />
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Globe className="h-[1.2rem] w-[1.2rem]" />
                                <span className="sr-only">Change language</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                English
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                Kannada
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild variant="outline">
                        <Link href="/">
                            <LogOut />
                            <span>Logout</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
