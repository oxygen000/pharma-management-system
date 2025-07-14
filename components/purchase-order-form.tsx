"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Printer, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  code: string
  price: number
  warehouse: string
  stock: number
}

interface OrderItem extends Product {
  quantity: number
}

const mockProducts: Product[] = [
  { id: "1", name: "Paracetamol 500mg", code: "MED001", price: 0.25, warehouse: "WH-001", stock: 1000 },
  { id: "2", name: "Amoxicillin 250mg", code: "MED002", price: 0.85, warehouse: "WH-002", stock: 500 },
  { id: "3", name: "Ibuprofen 400mg", code: "MED003", price: 0.45, warehouse: "WH-001", stock: 750 },
  { id: "4", name: "Aspirin 75mg", code: "MED004", price: 0.15, warehouse: "WH-003", stock: 300 },
  { id: "5", name: "Metformin 500mg", code: "MED005", price: 0.65, warehouse: "WH-002", stock: 600 },
]

export function PurchaseOrderForm() {
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const { toast } = useToast()

  const addToOrder = () => {
    const product = mockProducts.find((p) => p.id === selectedProduct)
    if (!product) return

    const existingItem = orderItems.find((item) => item.id === product.id)
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)),
      )
    } else {
      setOrderItems([...orderItems, { ...product, quantity }])
    }

    setSelectedProduct("")
    setQuantity(1)

    toast({
      title: "Product added",
      description: `${product.name} added to order`,
    })
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setOrderItems(orderItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const generateInvoice = () => {
    if (orderItems.length === 0) {
      toast({
        title: "No items in order",
        description: "Please add items to generate an invoice",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would generate a PDF or open a print dialog
    toast({
      title: "Invoice generated",
      description: "Purchase order invoice is ready for printing",
    })
  }

  const saveOrder = () => {
    if (orderItems.length === 0) {
      toast({
        title: "No items in order",
        description: "Please add items before saving",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Order saved",
      description: `Purchase order with ${orderItems.length} items has been saved`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Add Products Section */}
      <Card>
        <CardHeader>
          <CardTitle>Add Products</CardTitle>
          <CardDescription>Select products to add to your purchase order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="product">Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - ${product.price} ({product.warehouse})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <Button onClick={addToOrder} disabled={!selectedProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      {orderItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>Review and modify your order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.code}</Badge>
                      </TableCell>
                      <TableCell>{item.warehouse}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Order Summary */}
            <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Items: {orderItems.length}</p>
                <p className="text-sm text-gray-600">
                  Total Quantity: {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${getTotalAmount().toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Amount</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={saveOrder}>
                <Save className="mr-2 h-4 w-4" />
                Save Order
              </Button>
              <Button onClick={generateInvoice}>
                <Printer className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
