"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  FileSpreadsheet,
  Download,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Database,
  Eye,
  Trash2,
  TrendingUp,
  Search,
  TrendingDown,
  DollarSign,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"

interface ExcelData {
  [key: string]: string | number | boolean | null
}

interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: number
}

interface ProcessingStats {
  totalRows: number
  validRows: number
  errorRows: number
  duplicateRows: number
}

interface WarehouseData {
  warehouseId: string
  warehouseName: string
  itemCode: string
  itemName: string
  price: number
  baseDiscount: number
  finalPrice: number
  stock?: number
}

interface ProductSearchResult {
  itemCode: string
  itemName: string
  warehouses: WarehouseData[]
  highestDiscount: WarehouseData
  lowestDiscount: WarehouseData
  bestPrice: WarehouseData
}

export function ExcelUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [data, setData] = useState<ExcelData[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStats, setProcessingStats] = useState<ProcessingStats | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string>("")
  const [availableSheets, setAvailableSheets] = useState<string[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const { toast } = useToast()

  const [warehouseFiles, setWarehouseFiles] = useState<Map<string, { data: WarehouseData[]; fileName: string }>>(
    new Map(),
  )
  const [mergedData, setMergedData] = useState<WarehouseData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([])
  const [highestDiscountProduct, setHighestDiscountProduct] = useState<WarehouseData | null>(null)
  const [showSearchResults, setShowSearchResults] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const processFile = (selectedFile: File) => {
    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ]

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast({
        title: "Invalid file type",
        description: "Please select an Excel file (.xlsx, .xls) or CSV file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setFileInfo({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: selectedFile.lastModified,
    })
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an Excel file to upload",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setUploadProgress(0)
    setErrors([])

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })

          // Get all sheet names
          const sheetNames = workbook.SheetNames
          setAvailableSheets(sheetNames)

          // Process first sheet by default
          const firstSheetName = sheetNames[0]
          setSelectedSheet(firstSheetName)

          processSheet(workbook, firstSheetName, file.name)

          clearInterval(progressInterval)
          setUploadProgress(100)

          setTimeout(() => {
            setIsLoading(false)
            toast({
              title: "File uploaded successfully",
              description: `Processed ${data.length} rows from ${file.name}`,
            })
          }, 500)
        } catch (error) {
          clearInterval(progressInterval)
          setIsLoading(false)
          setErrors([`Error parsing file: ${error instanceof Error ? error.message : "Unknown error"}`])
          toast({
            title: "Error processing file",
            description: "There was an error reading the Excel file",
            variant: "destructive",
          })
        }
      }

      reader.onerror = () => {
        clearInterval(progressInterval)
        setIsLoading(false)
        toast({
          title: "Error reading file",
          description: "There was an error reading the file",
          variant: "destructive",
        })
      }

      reader.readAsArrayBuffer(file)
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Upload failed",
        description: "There was an error uploading the file",
        variant: "destructive",
      })
    }
  }

  const processSheet = (workbook: XLSX.WorkBook, sheetName: string, fileName: string) => {
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    if (jsonData.length === 0) {
      setErrors(["The selected sheet is empty"])
      return
    }

    // Extract headers from first row
    const headerRow = jsonData[0] as string[]
    const cleanHeaders = headerRow.map((header) =>
      header ? String(header).trim() : `Column_${headerRow.indexOf(header) + 1}`,
    )

    // Find required column indices
    const itemCodeIndex = cleanHeaders.findIndex(
      (h) =>
        h.toLowerCase().includes("item code") ||
        h.toLowerCase().includes("itemcode") ||
        h.toLowerCase().includes("code"),
    )
    const itemNameIndex = cleanHeaders.findIndex(
      (h) =>
        h.toLowerCase().includes("item name") ||
        h.toLowerCase().includes("itemname") ||
        h.toLowerCase().includes("name") ||
        h.toLowerCase().includes("product"),
    )
    const priceIndex = cleanHeaders.findIndex(
      (h) => h.toLowerCase().includes("price") || h.toLowerCase().includes("cost"),
    )
    const discountIndex = cleanHeaders.findIndex(
      (h) => h.toLowerCase().includes("discount") || h.toLowerCase().includes("base discount"),
    )

    // Process data rows
    const dataRows = jsonData.slice(1)
    const processedData: ExcelData[] = []
    const warehouseData: WarehouseData[] = []
    const errorList: string[] = []
    let validRows = 0
    let duplicateRows = 0

    // Extract warehouse name from filename
    const warehouseName = fileName.replace(/\.(xlsx|xls|csv)$/i, "").replace(/[_-]/g, " ")

    dataRows.forEach((row, index) => {
      try {
        const rowData: ExcelData = {}
        let hasData = false

        cleanHeaders.forEach((header, colIndex) => {
          const cellValue = row[colIndex]
          if (cellValue !== undefined && cellValue !== null && cellValue !== "") {
            hasData = true
            if (typeof cellValue === "number") {
              rowData[header] = cellValue
            } else if (typeof cellValue === "boolean") {
              rowData[header] = cellValue
            } else {
              rowData[header] = String(cellValue).trim()
            }
          } else {
            rowData[header] = null
          }
        })

        if (hasData) {
          // Check for required fields
          const itemCode = row[itemCodeIndex]
          const itemName = row[itemNameIndex]
          const price = row[priceIndex]
          const discount = row[discountIndex]

          if (itemCode && itemName && price !== undefined && discount !== undefined) {
            const priceNum = typeof price === "number" ? price : Number.parseFloat(String(price))
            const discountNum = typeof discount === "number" ? discount : Number.parseFloat(String(discount))

            if (!isNaN(priceNum) && !isNaN(discountNum)) {
              const finalPrice = priceNum * (1 - discountNum / 100)

              const warehouseItem: WarehouseData = {
                warehouseId: warehouseName.toLowerCase().replace(/\s+/g, "-"),
                warehouseName: warehouseName,
                itemCode: String(itemCode).trim(),
                itemName: String(itemName).trim(),
                price: priceNum,
                baseDiscount: discountNum,
                finalPrice: finalPrice,
                stock: row[cleanHeaders.findIndex((h) => h.toLowerCase().includes("stock"))] || undefined,
              }

              warehouseData.push(warehouseItem)
              validRows++
            } else {
              errorList.push(`Row ${index + 2}: Invalid price or discount value`)
            }
          } else {
            errorList.push(`Row ${index + 2}: Missing required fields (Item Code, Item Name, Price, or Discount)`)
          }

          // Check for duplicates (simple check based on first column)
          const firstColValue = rowData[cleanHeaders[0]]
          const isDuplicate = processedData.some((existing) => existing[cleanHeaders[0]] === firstColValue)

          if (isDuplicate) {
            duplicateRows++
            errorList.push(`Row ${index + 2}: Duplicate entry detected`)
          } else {
            processedData.push(rowData)
          }
        }
      } catch (error) {
        errorList.push(`Row ${index + 2}: ${error instanceof Error ? error.message : "Processing error"}`)
      }
    })

    setHeaders(cleanHeaders)
    setData(processedData)
    setErrors(errorList)
    setProcessingStats({
      totalRows: dataRows.length,
      validRows,
      errorRows: errorList.length,
      duplicateRows,
    })

    // Store warehouse data
    const newWarehouseFiles = new Map(warehouseFiles)
    newWarehouseFiles.set(warehouseName, { data: warehouseData, fileName })
    setWarehouseFiles(newWarehouseFiles)

    // Merge all warehouse data
    const allWarehouseData: WarehouseData[] = []
    newWarehouseFiles.forEach(({ data }) => {
      allWarehouseData.push(...data)
    })
    setMergedData(allWarehouseData)

    // Find highest discount product
    if (allWarehouseData.length > 0) {
      const highest = allWarehouseData.reduce((max, item) => (item.baseDiscount > max.baseDiscount ? item : max))
      setHighestDiscountProduct(highest)
    }
  }

  const handleSheetChange = (sheetName: string) => {
    if (!file) return

    setSelectedSheet(sheetName)

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: "array" })
      processSheet(workbook, sheetName, file.name)
    }
    reader.readAsArrayBuffer(file)
  }

  const removeFile = () => {
    setFile(null)
    setFileInfo(null)
    setData([])
    setHeaders([])
    setErrors([])
    setProcessingStats(null)
    setAvailableSheets([])
    setSelectedSheet("")
    setUploadProgress(0)
  }

  const downloadTemplate = () => {
    // Create a sample template
    const templateData = [
      ["Product Code", "Product Name", "Category", "Quantity", "Price", "Warehouse", "Supplier"],
      ["MED001", "Paracetamol 500mg", "Pain Relief", 1000, 0.25, "WH-001", "PharmaCorp"],
      ["MED002", "Amoxicillin 250mg", "Antibiotic", 500, 0.85, "WH-002", "MediSupply"],
      ["MED003", "Ibuprofen 400mg", "Pain Relief", 750, 0.45, "WH-001", "HealthDist"],
    ]

    const ws = XLSX.utils.aoa_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Template")
    XLSX.writeFile(wb, "pharmaceutical_template.xlsx")

    toast({
      title: "Template downloaded",
      description: "Excel template has been downloaded to your device",
    })
  }

  const exportData = () => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "Please upload and process a file first",
        variant: "destructive",
      })
      return
    }

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Processed Data")
    XLSX.writeFile(wb, `processed_${fileInfo?.name || "data"}.xlsx`)

    toast({
      title: "Data exported",
      description: "Processed data has been exported successfully",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const productMap = new Map<string, WarehouseData[]>()

    // Group products by item code
    mergedData.forEach((item) => {
      if (item.itemCode.toLowerCase().includes(query) || item.itemName.toLowerCase().includes(query)) {
        const key = `${item.itemCode}-${item.itemName}`
        if (!productMap.has(key)) {
          productMap.set(key, [])
        }
        productMap.get(key)!.push(item)
      }
    })

    const results: ProductSearchResult[] = []
    productMap.forEach((warehouses, key) => {
      const [itemCode, itemName] = key.split("-", 2)

      // Find highest and lowest discount
      const highestDiscount = warehouses.reduce((max, item) => (item.baseDiscount > max.baseDiscount ? item : max))
      const lowestDiscount = warehouses.reduce((min, item) => (item.baseDiscount < min.baseDiscount ? item : min))
      const bestPrice = warehouses.reduce((min, item) => (item.finalPrice < min.finalPrice ? item : min))

      results.push({
        itemCode,
        itemName,
        warehouses: warehouses.sort((a, b) => b.baseDiscount - a.baseDiscount),
        highestDiscount,
        lowestDiscount,
        bestPrice,
      })
    })

    setSearchResults(results)
    setShowSearchResults(true)
  }

  const clearAllData = () => {
    setWarehouseFiles(new Map())
    setMergedData([])
    setSearchResults([])
    setHighestDiscountProduct(null)
    setShowSearchResults(false)
    setSearchQuery("")
    removeFile()
  }

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Excel File Upload
          </CardTitle>
          <CardDescription>
            Upload Excel files (.xlsx, .xls) or CSV files to import and process your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragOver ? "Drop your file here" : "Drag and drop your Excel file here"}
              </p>
              <p className="text-sm text-muted-foreground">or click below to browse and select a file</p>
            </div>
          </div>

          {/* File Input and Actions */}
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleUpload} disabled={!file || isLoading}>
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Template
            </Button>
          </div>

          {/* Upload Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Info */}
      {fileInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                File Information
              </div>
              <Button variant="outline" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">File Name</p>
                <p className="font-medium">{fileInfo.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">File Size</p>
                <p className="font-medium">{formatFileSize(fileInfo.size)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">File Type</p>
                <p className="font-medium">{fileInfo.type || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Modified</p>
                <p className="font-medium">{new Date(fileInfo.lastModified).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Stats */}
      {processingStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{processingStats.totalRows}</p>
                  <p className="text-sm text-muted-foreground">Total Rows</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{processingStats.validRows}</p>
                  <p className="text-sm text-muted-foreground">Valid Rows</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{processingStats.errorRows}</p>
                  <p className="text-sm text-muted-foreground">Error Rows</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{processingStats.duplicateRows}</p>
                  <p className="text-sm text-muted-foreground">Duplicates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Highest Discount Product */}
      {highestDiscountProduct && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="h-5 w-5" />
              Highest Discount Found
            </CardTitle>
            <CardDescription>Best discount percentage across all uploaded warehouses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Item Code</p>
                <p className="text-lg font-bold">{highestDiscountProduct.itemCode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Item Name</p>
                <p className="text-lg font-bold">{highestDiscountProduct.itemName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Base Discount</p>
                <p className="text-2xl font-bold text-green-600">{highestDiscountProduct.baseDiscount}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warehouse</p>
                <p className="text-lg font-bold">{highestDiscountProduct.warehouseName}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Original Price</p>
                <p className="font-medium">${highestDiscountProduct.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Final Price</p>
                <p className="font-medium text-green-600">${highestDiscountProduct.finalPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">You Save</p>
                <p className="font-medium text-green-600">
                  ${(highestDiscountProduct.price - highestDiscountProduct.finalPrice).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warehouse Files Summary */}
      {warehouseFiles.size > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Uploaded Warehouses
                </CardTitle>
                <CardDescription>
                  {warehouseFiles.size} warehouse file(s) uploaded with {mergedData.length} total products
                </CardDescription>
              </div>
              <Button variant="outline" onClick={clearAllData}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(warehouseFiles.entries()).map(([warehouseName, { data, fileName }]) => (
                <div key={warehouseName} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{warehouseName}</h4>
                    <Badge variant="outline">{data.length} items</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{fileName}</p>
                  <div className="text-xs text-muted-foreground">
                    Avg Discount: {(data.reduce((sum, item) => sum + item.baseDiscount, 0) / data.length).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Search */}
      {mergedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Product Search & Comparison
            </CardTitle>
            <CardDescription>
              Search for products across all warehouses and compare prices and discounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by item code or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            {showSearchResults && (
              <div className="space-y-6">
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Search Results ({searchResults.length} product{searchResults.length !== 1 ? "s" : ""} found)
                  </h3>

                  {searchResults.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No products found matching your search criteria
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {searchResults.map((result, index) => (
                        <Card key={index} className="border-l-4 border-l-blue-500">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{result.itemName}</CardTitle>
                                <CardDescription>
                                  <Badge variant="outline" className="mr-2">
                                    {result.itemCode}
                                  </Badge>
                                  Available in {result.warehouses.length} warehouse
                                  {result.warehouses.length !== 1 ? "s" : ""}
                                </CardDescription>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">Best Discount</div>
                                <div className="text-2xl font-bold text-green-600">
                                  {result.highestDiscount.baseDiscount}%
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-800">Highest Discount</span>
                                  </div>
                                  <div className="text-lg font-bold text-green-600">
                                    {result.highestDiscount.baseDiscount}%
                                  </div>
                                  <div className="text-sm text-green-700">{result.highestDiscount.warehouseName}</div>
                                </CardContent>
                              </Card>

                              <Card className="bg-red-50 border-red-200">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                    <span className="text-sm font-medium text-red-800">Lowest Discount</span>
                                  </div>
                                  <div className="text-lg font-bold text-red-600">
                                    {result.lowestDiscount.baseDiscount}%
                                  </div>
                                  <div className="text-sm text-red-700">{result.lowestDiscount.warehouseName}</div>
                                </CardContent>
                              </Card>

                              <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800">Best Price</span>
                                  </div>
                                  <div className="text-lg font-bold text-blue-600">
                                    ${result.bestPrice.finalPrice.toFixed(2)}
                                  </div>
                                  <div className="text-sm text-blue-700">{result.bestPrice.warehouseName}</div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Detailed Comparison Table */}
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Warehouse</TableHead>
                                    <TableHead>Original Price</TableHead>
                                    <TableHead>Base Discount</TableHead>
                                    <TableHead>Final Price</TableHead>
                                    <TableHead>You Save</TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {result.warehouses.map((warehouse, idx) => {
                                    const isHighestDiscount =
                                      warehouse.baseDiscount === result.highestDiscount.baseDiscount
                                    const isLowestDiscount =
                                      warehouse.baseDiscount === result.lowestDiscount.baseDiscount
                                    const isBestPrice = warehouse.finalPrice === result.bestPrice.finalPrice
                                    const savings = warehouse.price - warehouse.finalPrice

                                    return (
                                      <TableRow key={idx}>
                                        <TableCell className="font-medium">{warehouse.warehouseName}</TableCell>
                                        <TableCell>${warehouse.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                          <span className={isHighestDiscount ? "font-bold text-green-600" : ""}>
                                            {warehouse.baseDiscount}%
                                          </span>
                                        </TableCell>
                                        <TableCell>
                                          <span className={isBestPrice ? "font-bold text-blue-600" : ""}>
                                            ${warehouse.finalPrice.toFixed(2)}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-green-600">${savings.toFixed(2)}</TableCell>
                                        <TableCell>
                                          <div className="flex gap-1">
                                            {isHighestDiscount && (
                                              <Badge variant="default" className="text-xs bg-green-600">
                                                Best Discount
                                              </Badge>
                                            )}
                                            {isBestPrice && (
                                              <Badge variant="secondary" className="text-xs">
                                                Best Price
                                              </Badge>
                                            )}
                                            {isLowestDiscount && warehouse !== result.highestDiscount && (
                                              <Badge variant="outline" className="text-xs text-red-600">
                                                Lowest Discount
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
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Data Display */}
      {data.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Uploaded Data
                </CardTitle>
                <CardDescription>{data.length} rows processed from the Excel file</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="outline" onClick={removeFile}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="data" className="space-y-4">
              <TabsList>
                <TabsTrigger value="data">Data View</TabsTrigger>
                {availableSheets.length > 1 && <TabsTrigger value="sheets">Sheets</TabsTrigger>}
                {errors.length > 0 && <TabsTrigger value="errors">Errors ({errors.length})</TabsTrigger>}
              </TabsList>

              <TabsContent value="data" className="space-y-4">
                {availableSheets.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Current Sheet:</span>
                    <Badge variant="outline">{selectedSheet}</Badge>
                  </div>
                )}

                <div className="rounded-md border overflow-auto max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        {headers.map((header, index) => (
                          <TableHead key={index} className="min-w-32">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          {headers.map((header, cellIndex) => (
                            <TableCell key={cellIndex}>
                              {row[header] !== null && row[header] !== undefined ? String(row[header]) : "-"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {availableSheets.length > 1 && (
                <TabsContent value="sheets">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This file contains multiple sheets. Click on a sheet name to view its data.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {availableSheets.map((sheetName) => (
                        <Button
                          key={sheetName}
                          variant={selectedSheet === sheetName ? "default" : "outline"}
                          onClick={() => handleSheetChange(sheetName)}
                          className="justify-start"
                        >
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          {sheetName}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {errors.length > 0 && (
                <TabsContent value="errors">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      The following errors were encountered during processing:
                    </p>
                    <div className="space-y-2 max-h-64 overflow-auto">
                      {errors.map((error, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
