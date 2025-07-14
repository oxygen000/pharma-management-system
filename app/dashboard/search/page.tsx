import { ProductSearch } from "@/components/product-search"

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Search & Analytics</h1>
        <p className="text-gray-600">Search products and compare prices across warehouses</p>
      </div>

      <ProductSearch />
    </div>
  )
}
