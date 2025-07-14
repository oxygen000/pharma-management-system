"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Package, Users, ShoppingCart, AlertTriangle, Eye } from "lucide-react"

const mockData = {
  totalOrders: 1247,
  totalUsers: 45,
  totalProducts: 2834,
  totalWarehouses: 8,
  totalRevenue: 348000,
  monthlyGrowth: 12.5,
  recentOrders: [
    {
      id: "PO-001",
      pharmacy: "City Pharmacy",
      amount: 15420,
      status: "completed",
      date: "2024-01-15",
      items: 12,
    },
    {
      id: "PO-002",
      pharmacy: "Health Plus",
      amount: 8750,
      status: "pending",
      date: "2024-01-14",
      items: 8,
    },
    {
      id: "PO-003",
      pharmacy: "MediCare",
      amount: 12300,
      status: "processing",
      date: "2024-01-13",
      items: 15,
    },
    {
      id: "PO-004",
      pharmacy: "Wellness Center",
      amount: 9850,
      status: "completed",
      date: "2024-01-12",
      items: 6,
    },
  ],
  chartData: [
    { month: "Jan", orders: 65, revenue: 45000 },
    { month: "Feb", orders: 78, revenue: 52000 },
    { month: "Mar", orders: 92, revenue: 48000 },
    { month: "Apr", orders: 85, revenue: 61000 },
    { month: "May", orders: 98, revenue: 55000 },
    { month: "Jun", orders: 110, revenue: 67000 },
  ],
  alerts: [
    { type: "low_stock", count: 23, severity: "warning" },
    { type: "pending_orders", count: 8, severity: "info" },
    { type: "overdue_payments", count: 3, severity: "error" },
  ],
}

export function AdminDashboard() {
  const maxRevenue = Math.max(...mockData.chartData.map((d) => d.revenue))
  const maxOrders = Math.max(...mockData.chartData.map((d) => d.orders))

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">Complete overview of your pharmaceutical management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">${mockData.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+{mockData.monthlyGrowth}%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{mockData.totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+8.2%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Products</CardTitle>
            <Package className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{mockData.totalProducts.toLocaleString()}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+156</span>
              <span className="text-muted-foreground ml-1">new products</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{mockData.totalUsers}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+5</span>
              <span className="text-muted-foreground ml-1">new users</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockData.alerts.map((alert, index) => (
          <Card
            key={index}
            className={`border-l-4 ${
              alert.severity === "error"
                ? "border-l-red-500"
                : alert.severity === "warning"
                  ? "border-l-orange-500"
                  : "border-l-blue-500"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      alert.severity === "error"
                        ? "text-red-500"
                        : alert.severity === "warning"
                          ? "text-orange-500"
                          : "text-blue-500"
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {alert.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
                <Badge variant={alert.severity === "error" ? "destructive" : "secondary"}>{alert.count}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <CardDescription>Latest purchase orders in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{order.id}</p>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.pharmacy}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.date} • {order.items} items
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-medium">${order.amount.toLocaleString()}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart - Simple Bar Chart */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue and order trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.chartData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="text-right">
                      <p className="text-sm font-medium">${item.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={(item.revenue / maxRevenue) * 100} className="h-2" />
                    <Progress value={(item.orders / maxOrders) * 100} className="h-1 opacity-60" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Users className="h-5 w-5" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Package className="h-5 w-5" />
              <span>Add Products</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <ShoppingCart className="h-5 w-5" />
              <span>View Orders</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <TrendingUp className="h-5 w-5" />
              <span>Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
