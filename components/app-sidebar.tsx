"use client"

import { BarChart3, FileSpreadsheet, Home, Package, Search, ShoppingCart, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "./auth-provider"
import Link from "next/link"

export function AppSidebar() {
  const { user } = useAuth()

  const getMenuItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Excel Upload",
        url: "/dashboard/upload",
        icon: FileSpreadsheet,
      },
      {
        title: "Purchase Orders",
        url: "/dashboard/orders",
        icon: ShoppingCart,
      },
      {
        title: "Product Search",
        url: "/dashboard/search",
        icon: Search,
      },
    ]

    if (user?.role === "admin") {
      baseItems.push(
        {
          title: "User Management",
          url: "/dashboard/users",
          icon: Users,
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
          icon: BarChart3,
        },
      )
    }

    if (user?.role === "warehouse") {
      baseItems.push({
        title: "Inventory",
        url: "/dashboard/inventory",
        icon: Package,
      })
    }

    return baseItems
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>PharmaPro</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
