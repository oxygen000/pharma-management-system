"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingDown, TrendingUp } from "lucide-react"

interface ProductData {
  id: string
  name: string
  code: string
  category: string
  warehouses: {
    id: string
    name: string
    stock: number
    price: number
    discount: number
  }[]
}

const mockProducts: ProductData[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    code: "MED001",
    category: "Pain Relief",
    warehouses: [
      { id: "WH-001", name: "Central Warehouse", stock: 1000, price: 0.25, discount: 5 },
      { id: "WH-002", name: "North Warehouse", stock: 750, price: 0.28, discount: 3 },
      { id: "WH-003", name: "South Warehouse", stock: 500, price: 0.22, discount: 8 },
    ],
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    code: "MED002",
    category: "Antibiotic",
    warehouses: [
      { id: "WH-001", name: "Central Warehouse", stock: 300, price: 0.85, discount: 2 },
      { id: "WH-002", name: "North Warehouse", stock: 200, price: 0.82, discount: 5 },
      { id: "WH-004", name: "East Warehouse", stock: 150, price: 0.88, discount: 1 },
    ],
  },
  {
    id: "3",
    name: "Ibuprofen 400mg",
    code: "MED003",
    category: "Pain Relief",
    warehouses: [
      { id: "WH-001", name: "Central Warehouse", stock: 800, price: 0.45, discount: 4 },
      { id: "WH-003", name: "South Warehouse", stock: 600, price: 0.42, discount: 7 },
      { id: "WH-004", name: "East Warehouse", stock: 400, price: 0.48, discount: 2 },
    ],
  },
]

export function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleSearch = () => {
    let results = mockProducts

    if (searchTerm) {
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.code.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      results = results.filter((product) => product.category === categoryFilter)
    }

    setFilteredProducts(results)
    setShowResults(true)
  }

  const getBestPrice = (warehouses: ProductData["warehouses"]) => {
    return Math.min(...warehouses.map((w) => w.price * (1 - w.discount / 100)))
  }

  const getBestDiscount = (warehouses: ProductData["warehouses"]) => {
    return Math.max(...warehouses.map((w) => w.discount))
  }

  const getTotalStock = (warehouses: ProductData["warehouses"]) => {
    return warehouses.reduce((total, w) => total + w.stock, 0)
  }

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
          <CardDescription>Find products and compare prices across warehouses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                placeholder="Search by product name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                  <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                  <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                  <SelectItem value="Diabetes">Diabetes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {filteredProducts.length} product(s) matching your criteria</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No products found matching your search criteria</div>
            ) : (
              <div className="space-y-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{product.code}</Badge>
                          <Badge>{product.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingDown className="h-4 w-4 text-green-600" />
                          Best Price: ${getBestPrice(product.warehouses).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          Best Discount: {getBestDiscount(product.warehouses)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Stock: {getTotalStock(product.warehouses)} units
                        </div>
                      </div>
                    </div>

                    {/* Warehouse Comparison */}
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Warehouse</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Final Price</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.warehouses.map((warehouse) => {
                            const finalPrice = warehouse.price * (1 - warehouse.discount / 100)
                            const isBestPrice = finalPrice === getBestPrice(product.warehouses)
                            const isBestDiscount = warehouse.discount === getBestDiscount(product.warehouses)

                            return (
                              <TableRow key={warehouse.id}>
                                <TableCell className="font-medium">{warehouse.name}</TableCell>
                                <TableCell>
                                  <span
                                    className={
                                      warehouse.stock < 100
                                        ? "text-red-600"
                                        : warehouse.stock < 300
                                          ? "text-orange-600"
                                          : "text-green-600"
                                    }
                                  >
                                    {warehouse.stock}
                                  </span>
                                </TableCell>
                                <TableCell>${warehouse.price.toFixed(2)}</TableCell>
                                <TableCell>
                                  <span className={isBestDiscount ? "font-bold text-blue-600" : ""}>
                                    {warehouse.discount}%
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className={isBestPrice ? "font-bold text-green-600" : ""}>
                                    ${finalPrice.toFixed(2)}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    {isBestPrice && (
                                      <Badge variant="default" className="text-xs">
                                        Best Price
                                      </Badge>
                                    )}
                                    {isBestDiscount && (
                                      <Badge variant="secondary" className="text-xs">
                                        Best Discount
                                      </Badge>
                                    )}
                                    {warehouse.stock < 100 && (
                                      <Badge variant="destructive" className="text-xs">
                                        Low Stock
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
