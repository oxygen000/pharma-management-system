import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PharmaPro</h1>
          <p className="text-gray-600">Pharmaceutical Purchase Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo Credentials:</p>
          <p>
            <strong>Admin:</strong> admin@pharma.com / admin123
          </p>
          <p>
            <strong>Warehouse:</strong> warehouse@pharma.com / warehouse123
          </p>
          <p>
            <strong>Pharmacy:</strong> pharmacy@pharma.com / pharmacy123
          </p>
        </div>
      </div>
    </div>
  )
}
