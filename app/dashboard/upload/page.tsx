import { ExcelUpload } from "@/components/excel-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Excel Upload</h1>
        <p className="text-gray-600">Upload and process Excel files for bulk data import</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Excel File</CardTitle>
          <CardDescription>
            Upload an Excel file to import product data, inventory updates, or purchase orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExcelUpload />
        </CardContent>
      </Card>
    </div>
  )
}
