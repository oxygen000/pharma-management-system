"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DollarSign, ShoppingCart, Clock, TrendingUp, Package, Eye, Download, Calendar } from "lucide-react"

const mockOrders = [
  {
    id: "PO-2024-001",
    date: "2024-01-15",
    items: 12,
    total: 2450,
    status: "delivered",
    warehouse: "Central Warehouse",
    deliveryDate: "2024-01-17",
    trackingNumber: "TRK001234",
  },
  {
    id: "PO-2024-002",
    date: "2024-01-14",
    items: 8,
    total: 1320,
    status: "processing",
    warehouse: "North Warehouse",
    estimatedDelivery: "2024-01-18",
    trackingNumber: "TRK001235",
  },
  {
    id: "PO-2024-003",
    date: "2024-01-13",
    items: 15,
    total: 3200,
    status: "pending",
    warehouse: "South Warehouse",
    estimatedDelivery: "2024-01-19",
    trackingNumber: "TRK001236",
  },
  {
    id: "PO-2024-004",
    date: "2024-01-12",
    items: 6,
    total: 890,
    status: "delivered",
    warehouse: "East Warehouse",
    deliveryDate: "2024-01-14",
    trackingNumber: "TRK001237",
  },
]

const monthlyStats = {
  currentMonth: {
    orders: 28,
    spending: 12450,
    avgOrder: 445,
    savings: 1250,
  },
  lastMonth: {
    orders: 24,
    spending: 10800,
    avgOrder: 450,
    savings: 980,
  },
}

const topProducts = [
  { name: "Paracetamol 500mg", quantity: 500, spending: 125, frequency: "Weekly" },
  { name: "Amoxicillin 250mg", quantity: 200, spending: 170, frequency: "Bi-weekly" },
  { name: "Ibuprofen 400mg", quantity: 300, spending: 135, frequency: "Weekly" },
  { name: "Aspirin 75mg", quantity: 150, spending: 22.5, frequency: "Monthly" },
]

export function PharmacyDashboard() {
  const growthRate = (
    ((monthlyStats.currentMonth.spending - monthlyStats.lastMonth.spending) / monthlyStats.lastMonth.spending) *
    100
  ).toFixed(1)
  const orderGrowth = (
    ((monthlyStats.currentMonth.orders - monthlyStats.lastMonth.orders) / monthlyStats.lastMonth.orders) *
    100
  ).toFixed(1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Pharmacy Dashboard</h1>
        <p className="text-lg text-muted-foreground">Your comprehensive order management and purchase analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">${monthlyStats.currentMonth.spending.toLocaleString()}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+{growthRate}%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">{monthlyStats.currentMonth.orders}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+{orderGrowth}%</span>
              <span className="text-muted-foreground ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">
              {mockOrders.filter((order) => order.status === "pending" || order.status === "processing").length}
            </div>
            <p className="text-sm text-muted-foreground">Orders processing</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Order</CardTitle>
            <Package className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">${monthlyStats.currentMonth.avgOrder}</div>
            <p className="text-sm text-muted-foreground">Order value</p>
          </CardContent>
        </Card>
      </div>

      {/* Savings Alert */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">
                You've saved ${monthlyStats.currentMonth.savings} this month!
              </p>
              <p className="text-sm text-green-700">Through bulk discounts and promotional offers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="analytics">Purchase Analytics</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest purchase orders and their status</CardDescription>
                </div>
                <Button variant="outline">View All Orders</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-lg">{order.id}</p>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "processing"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Ordered: {order.date}
                          </p>
                          <p>Warehouse: {order.warehouse}</p>
                          <p>Tracking: {order.trackingNumber}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-2xl font-bold">${order.total.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{order.items} items</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm">
                        {order.status === "delivered" ? (
                          <p className="text-green-600 flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            Delivered on {order.deliveryDate}
                          </p>
                        ) : (
                          <p className="text-blue-600 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Expected: {order.estimatedDelivery}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Comparison</CardTitle>
                <CardDescription>Current vs previous month performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Orders</span>
                    <span className="text-sm text-muted-foreground">
                      {monthlyStats.currentMonth.orders} vs {monthlyStats.lastMonth.orders}
                    </span>
                  </div>
                  <Progress
                    value={
                      (monthlyStats.currentMonth.orders /
                        (monthlyStats.currentMonth.orders + monthlyStats.lastMonth.orders)) *
                      100
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Spending</span>
                    <span className="text-sm text-muted-foreground">
                      ${monthlyStats.currentMonth.spending} vs ${monthlyStats.lastMonth.spending}
                    </span>
                  </div>
                  <Progress
                    value={
                      (monthlyStats.currentMonth.spending /
                        (monthlyStats.currentMonth.spending + monthlyStats.lastMonth.spending)) *
                      100
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Savings</span>
                    <span className="text-sm text-muted-foreground">
                      ${monthlyStats.currentMonth.savings} vs ${monthlyStats.lastMonth.savings}
                    </span>
                  </div>
                  <Progress
                    value={
                      (monthlyStats.currentMonth.savings /
                        (monthlyStats.currentMonth.savings + monthlyStats.lastMonth.savings)) *
                      100
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Breakdown of your current orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["delivered", "processing", "pending"].map((status) => {
                    const count = mockOrders.filter((order) => order.status === status).length
                    const percentage = (count / mockOrders.length) * 100

                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">{status}</span>
                          <span className="text-sm text-muted-foreground">{count} orders</span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Your most frequently ordered products</CardDescription>
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
                        <p className="text-sm text-muted-foreground">
                          {product.quantity} units • {product.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${product.spending}</p>
                      <p className="text-sm text-muted-foreground">Total spent</p>
                    </div>
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
