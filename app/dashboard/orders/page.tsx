import { PurchaseOrderForm } from "@/components/purchase-order-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <p className="text-gray-600">Create and manage purchase orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Purchase Order</CardTitle>
          <CardDescription>Select products and quantities to create a new purchase order</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseOrderForm />
        </CardContent>
      </Card>
    </div>
  )
}
