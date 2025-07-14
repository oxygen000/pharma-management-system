"use client"

import { useAuth } from "@/components/auth-provider"
import { AdminDashboard } from "@/components/admin-dashboard"
import { WarehouseDashboard } from "@/components/warehouse-dashboard"
import { PharmacyDashboard } from "@/components/pharmacy-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  switch (user.role) {
    case "admin":
      return <AdminDashboard />
    case "warehouse":
      return <WarehouseDashboard />
    case "pharmacy":
      return <PharmacyDashboard />
    default:
      return <div>Access denied</div>
  }
}
