"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardTrial } from "./dashboard-trial";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image src="/logo.svg" height={36} width={36} alt="Ronin AI" />
          <p className="text-2xl font-semibold">Ronin AI</p>
        </Link>
      </SidebarHeader>
      <div className="px-y py-2">
        <Separator className="text-[#5D6B68] opacity-10" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => {
                const { href, label } = item;
                const isActive = pathname === href;
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      className={cn(
                        "from-sidebar-accent via-sidebar/50 to-sidebar/50 h-10 border border-transparent from-5% via-30% hover:border-[#5D6B68]/10 hover:bg-linear-to-r/oklch",
                        {
                          "border-[#5D6B68]/10 bg-linear-to-r/oklch": isActive,
                        },
                      )}
                      isActive={isActive}
                      asChild
                    >
                      <Link href={href}>
                        <item.icon className="size-5" />
                        <span className="text-sm font-medium tracking-tight">
                          {label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-y py-2">
          <Separator className="text-[#5D6B68] opacity-10" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => {
                const { href, label } = item;
                const isActive = pathname === href;
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      className={cn(
                        "from-sidebar-accent via-sidebar/50 to-sidebar/50 h-10 border border-transparent from-5% via-30% hover:border-[#5D6B68]/10 hover:bg-linear-to-r/oklch",
                        {
                          "border-[#5D6B68]/10 bg-linear-to-r/oklch": isActive,
                        },
                      )}
                      isActive={isActive}
                      asChild
                    >
                      <Link href={href}>
                        <item.icon className="size-5" />
                        <span className="text-sm font-medium tracking-tight">
                          {label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-white">
        <DashboardTrial />
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
