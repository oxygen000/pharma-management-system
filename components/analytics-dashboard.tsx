"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

const salesData = [
  { month: "Jan", sales: 45000, orders: 120, profit: 12000 },
  { month: "Feb", sales: 52000, orders: 145, profit: 15600 },
  { month: "Mar", sales: 48000, orders: 132, profit: 14400 },
  { month: "Apr", sales: 61000, orders: 168, profit: 18300 },
  { month: "May", sales: 55000, orders: 155, profit: 16500 },
  { month: "Jun", sales: 67000, orders: 189, profit: 20100 },
]

const categoryData = [
  { name: "Pain Relief", value: 35, color: "bg-blue-500" },
  { name: "Antibiotics", value: 25, color: "bg-red-500" },
  { name: "Cardiovascular", value: 20, color: "bg-green-500" },
  { name: "Diabetes", value: 12, color: "bg-yellow-500" },
  { name: "Others", value: 8, color: "bg-purple-500" },
]

const warehousePerformance = [
  { name: "Central Warehouse", orders: 450, revenue: 125000, efficiency: 95 },
  { name: "North Warehouse", orders: 320, revenue: 89000, efficiency: 88 },
  { name: "South Warehouse", orders: 280, revenue: 76000, efficiency: 92 },
  { name: "East Warehouse", orders: 195, revenue: 54000, efficiency: 85 },
]

const topProducts = [
  { name: "Paracetamol 500mg", sales: 15420, growth: 12.5, trend: "up" },
  { name: "Amoxicillin 250mg", sales: 12800, growth: 8.3, trend: "up" },
  { name: "Ibuprofen 400mg", sales: 11200, growth: -2.1, trend: "down" },
  { name: "Aspirin 75mg", sales: 9800, growth: 15.7, trend: "up" },
  { name: "Metformin 500mg", sales: 8900, growth: 5.2, trend: "up" },
]

const inventoryAlerts = [
  { product: "Insulin Glargine", warehouse: "Central", level: 15, status: "critical" },
  { product: "Atorvastatin 20mg", warehouse: "North", level: 45, status: "low" },
  { product: "Lisinopril 10mg", warehouse: "South", level: 78, status: "medium" },
  { product: "Omeprazole 20mg", warehouse: "East", level: 120, status: "good" },
]

export function AnalyticsDashboard() {
  const maxSales = Math.max(...salesData.map((d) => d.sales))
  const maxOrders = Math.max(...salesData.map((d) => d.orders))
  const maxProfit = Math.max(...salesData.map((d) => d.profit))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive insights into your pharmaceutical business performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">$348,000</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+12.5%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">1,309</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+8.2%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Products</CardTitle>
            <Package className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">2,847</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+156</span>
              <span className="text-muted-foreground ml-1">new products</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">127</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+5</span>
              <span className="text-muted-foreground ml-1">new users</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Monthly sales performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.month}</span>
                        <span className="text-sm text-muted-foreground">${item.sales.toLocaleString()}</span>
                      </div>
                      <Progress value={(item.sales / maxSales) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best-selling products with growth trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">${product.sales.toLocaleString()} in sales</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${product.trend === "up" ? "text-green-500" : "text-red-500"}`}
                      >
                        {product.growth > 0 ? "+" : ""}
                        {product.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales vs Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Sales vs Orders</CardTitle>
                <CardDescription>Monthly comparison of sales and order volumes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.month}</span>
                        <div className="text-right text-sm">
                          <p>
                            ${item.sales.toLocaleString()} • {item.orders} orders
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={(item.sales / maxSales) * 100} className="h-2" />
                        <Progress value={(item.orders / maxOrders) * 100} className="h-1 opacity-60" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profit Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Profit Analysis</CardTitle>
                <CardDescription>Monthly profit trends and margins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.month}</span>
                        <span className="text-sm text-muted-foreground">${item.profit.toLocaleString()}</span>
                      </div>
                      <Progress value={(item.profit / maxProfit) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          {/* Inventory Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Products requiring attention based on stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {alert.status === "critical" ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : alert.status === "low" ? (
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <p className="font-medium">{alert.product}</p>
                        <p className="text-sm text-muted-foreground">{alert.warehouse} Warehouse</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{alert.level} units</p>
                        <Badge
                          variant={
                            alert.status === "critical"
                              ? "destructive"
                              : alert.status === "low"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Warehouse Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Performance</CardTitle>
              <CardDescription>Comparative analysis of warehouse operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {warehousePerformance.map((warehouse, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{warehouse.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {warehouse.orders} orders • ${warehouse.revenue.toLocaleString()} revenue
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{warehouse.efficiency}% efficiency</p>
                      </div>
                    </div>
                    <Progress value={warehouse.efficiency} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
