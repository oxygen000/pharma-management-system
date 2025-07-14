"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, AlertTriangle, TrendingUp, TrendingDown, Truck, CheckCircle, Clock, BarChart3 } from "lucide-react"

const mockInventory = [
  {
    name: "Paracetamol 500mg",
    code: "MED001",
    stock: 2500,
    capacity: 3000,
    status: "good",
    reorderLevel: 500,
    lastRestocked: "2024-01-10",
    supplier: "PharmaCorp",
  },
  {
    name: "Amoxicillin 250mg",
    code: "MED002",
    stock: 150,
    capacity: 1000,
    status: "low",
    reorderLevel: 200,
    lastRestocked: "2024-01-05",
    supplier: "MediSupply",
  },
  {
    name: "Ibuprofen 400mg",
    code: "MED003",
    stock: 1800,
    capacity: 2000,
    status: "good",
    reorderLevel: 400,
    lastRestocked: "2024-01-12",
    supplier: "HealthDist",
  },
  {
    name: "Aspirin 75mg",
    code: "MED004",
    stock: 50,
    capacity: 500,
    status: "critical",
    reorderLevel: 100,
    lastRestocked: "2023-12-28",
    supplier: "PharmaCorp",
  },
  {
    name: "Metformin 500mg",
    code: "MED005",
    stock: 800,
    capacity: 1200,
    status: "medium",
    reorderLevel: 300,
    lastRestocked: "2024-01-08",
    supplier: "DiabetesCare",
  },
]

const recentActivity = [
  { type: "restock", product: "Paracetamol 500mg", quantity: 500, time: "2 hours ago" },
  { type: "order", product: "Ibuprofen 400mg", quantity: -150, time: "4 hours ago" },
  { type: "alert", product: "Aspirin 75mg", message: "Low stock alert", time: "6 hours ago" },
  { type: "delivery", product: "Metformin 500mg", quantity: 300, time: "1 day ago" },
]

export function WarehouseDashboard() {
  const totalProducts = mockInventory.length
  const lowStockItems = mockInventory.filter((item) => item.status === "low" || item.status === "critical").length
  const outOfStockItems = mockInventory.filter((item) => item.stock === 0).length
  const totalStock = mockInventory.reduce((sum, item) => sum + item.stock, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Warehouse Dashboard</h1>
        <p className="text-lg text-muted-foreground">Comprehensive inventory management and stock monitoring</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <Package className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{totalStock.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Units in stock</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-orange-600">{lowStockItems}</div>
            <p className="text-sm text-muted-foreground">Need reorder</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-red-600">{outOfStockItems}</div>
            <p className="text-sm text-muted-foreground">Critical items</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Product Lines</CardTitle>
            <BarChart3 className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{totalProducts}</div>
            <p className="text-sm text-muted-foreground">Active products</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>Current stock levels for all products</CardDescription>
                </div>
                <Button variant="outline">Export Report</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockInventory.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.name}</p>
                          <Badge variant="outline">{item.code}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Supplier: {item.supplier} • Last restocked: {item.lastRestocked}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {item.stock.toLocaleString()} / {item.capacity.toLocaleString()} units
                          </p>
                          <p className="text-xs text-muted-foreground">Reorder at: {item.reorderLevel}</p>
                        </div>
                        <Badge
                          variant={
                            item.status === "critical"
                              ? "destructive"
                              : item.status === "low"
                                ? "secondary"
                                : item.status === "medium"
                                  ? "outline"
                                  : "default"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stock Level</span>
                        <span>{Math.round((item.stock / item.capacity) * 100)}%</span>
                      </div>
                      <Progress value={(item.stock / item.capacity) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest inventory movements and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === "restock" && <TrendingUp className="h-5 w-5 text-green-500" />}
                      {activity.type === "order" && <TrendingDown className="h-5 w-5 text-blue-500" />}
                      {activity.type === "alert" && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                      {activity.type === "delivery" && <Truck className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {activity.type === "restock" && `Restocked ${activity.product}`}
                        {activity.type === "order" && `Order fulfilled for ${activity.product}`}
                        {activity.type === "alert" && activity.message}
                        {activity.type === "delivery" && `Delivery received for ${activity.product}`}
                      </p>
                      {activity.quantity && (
                        <p className="text-sm text-muted-foreground">Quantity: {Math.abs(activity.quantity)} units</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Alerts
                </CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInventory
                    .filter((item) => item.status === "critical")
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-red-900">{item.name}</p>
                          <p className="text-sm text-red-700">Only {item.stock} units left</p>
                        </div>
                        <Button size="sm" variant="destructive">
                          Reorder Now
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common warehouse operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Package className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Update Stock Levels
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Truck className="mr-2 h-4 w-4" />
                    Schedule Delivery
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
