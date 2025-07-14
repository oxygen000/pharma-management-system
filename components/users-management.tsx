"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Calendar,
  Building,
  Shield,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "warehouse" | "pharmacy"
  status: "active" | "inactive" | "pending"
  avatar?: string
  phone?: string
  department?: string
  warehouse?: string
  pharmacy?: string
  lastLogin?: string
  createdAt: string
  permissions: string[]
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "admin@pharma.com",
    role: "admin",
    status: "active",
    phone: "+1 (555) 123-4567",
    department: "Administration",
    lastLogin: "2024-01-15 10:30 AM",
    createdAt: "2023-06-15",
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "warehouse@pharma.com",
    role: "warehouse",
    status: "active",
    phone: "+1 (555) 234-5678",
    warehouse: "Central Warehouse",
    lastLogin: "2024-01-15 09:15 AM",
    createdAt: "2023-08-20",
    permissions: ["inventory", "orders"],
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "pharmacy@pharma.com",
    role: "pharmacy",
    status: "active",
    phone: "+1 (555) 345-6789",
    pharmacy: "City Pharmacy",
    lastLogin: "2024-01-14 04:45 PM",
    createdAt: "2023-09-10",
    permissions: ["orders", "search"],
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "warehouse2@pharma.com",
    role: "warehouse",
    status: "active",
    phone: "+1 (555) 456-7890",
    warehouse: "North Warehouse",
    lastLogin: "2024-01-15 08:20 AM",
    createdAt: "2023-10-05",
    permissions: ["inventory", "orders"],
  },
  {
    id: "5",
    name: "David Brown",
    email: "pharmacy2@pharma.com",
    role: "pharmacy",
    status: "inactive",
    phone: "+1 (555) 567-8901",
    pharmacy: "Health Plus",
    lastLogin: "2024-01-10 02:30 PM",
    createdAt: "2023-11-12",
    permissions: ["orders"],
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "newuser@pharma.com",
    role: "pharmacy",
    status: "pending",
    phone: "+1 (555) 678-9012",
    pharmacy: "MediCare",
    createdAt: "2024-01-14",
    permissions: [],
  },
]

const rolePermissions = {
  admin: ["all"],
  warehouse: ["inventory", "orders", "analytics"],
  pharmacy: ["orders", "search", "profile"],
}

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "pharmacy",
    phone: "",
    warehouse: "",
    pharmacy: "",
  })
  const { toast } = useToast()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name!,
      email: newUser.email!,
      role: newUser.role as "admin" | "warehouse" | "pharmacy",
      status: "pending",
      phone: newUser.phone,
      warehouse: newUser.warehouse,
      pharmacy: newUser.pharmacy,
      createdAt: new Date().toISOString().split("T")[0],
      permissions: rolePermissions[newUser.role as keyof typeof rolePermissions] || [],
    }

    setUsers([...users, user])
    setNewUser({ name: "", email: "", role: "pharmacy", phone: "", warehouse: "", pharmacy: "" })
    setIsCreateDialogOpen(false)

    toast({
      title: "User Created",
      description: `${user.name} has been added to the system`,
    })
  }

  const handleEditUser = () => {
    if (!selectedUser) return

    setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)))
    setIsEditDialogOpen(false)
    setSelectedUser(null)

    toast({
      title: "User Updated",
      description: "User information has been updated successfully",
    })
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return

    setUsers(users.filter((user) => user.id !== selectedUser.id))
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)

    toast({
      title: "User Deleted",
      description: "User has been removed from the system",
    })
  }

  const handleStatusChange = (userId: string, newStatus: "active" | "inactive") => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: newStatus,
              lastLogin: newStatus === "active" ? new Date().toLocaleString() : user.lastLogin,
            }
          : user,
      ),
    )

    toast({
      title: "Status Updated",
      description: `User status changed to ${newStatus}`,
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "warehouse":
        return "bg-blue-100 text-blue-800"
      case "pharmacy":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const activeUsers = users.filter((user) => user.status === "active").length
  const pendingUsers = users.filter((user) => user.status === "pending").length
  const totalUsers = users.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">User Management</h1>
        <p className="text-lg text-muted-foreground">Manage system users, roles, and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <p className="text-sm text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            <UserCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeUsers}</div>
            <p className="text-sm text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <UserX className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingUsers}</div>
            <p className="text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
            <Shield className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
            <p className="text-sm text-muted-foreground">System administrators</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Users</CardTitle>
              <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system with appropriate role and permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role *</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="warehouse">Warehouse Manager</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  {newUser.role === "warehouse" && (
                    <div className="space-y-2">
                      <Label htmlFor="warehouse">Warehouse</Label>
                      <Select
                        value={newUser.warehouse}
                        onValueChange={(value) => setNewUser({ ...newUser, warehouse: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Central Warehouse">Central Warehouse</SelectItem>
                          <SelectItem value="North Warehouse">North Warehouse</SelectItem>
                          <SelectItem value="South Warehouse">South Warehouse</SelectItem>
                          <SelectItem value="East Warehouse">East Warehouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {newUser.role === "pharmacy" && (
                    <div className="space-y-2">
                      <Label htmlFor="pharmacy">Pharmacy</Label>
                      <Input
                        id="pharmacy"
                        value={newUser.pharmacy}
                        onChange={(e) => setNewUser({ ...newUser, pharmacy: e.target.value })}
                        placeholder="Enter pharmacy name"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser}>Create User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>

              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.warehouse && (
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {user.warehouse}
                              </div>
                            )}
                            {user.pharmacy && (
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {user.pharmacy}
                              </div>
                            )}
                            {user.department && (
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {user.department}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.lastLogin ? (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {user.lastLogin}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Never</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "active" ? (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "inactive")}>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Other tab contents would filter by status */}
            <TabsContent value="active">
              <div className="text-center py-8 text-muted-foreground">
                Active users view - would show only active users
              </div>
            </TabsContent>
            <TabsContent value="pending">
              <div className="text-center py-8 text-muted-foreground">
                Pending users view - would show only pending users
              </div>
            </TabsContent>
            <TabsContent value="inactive">
              <div className="text-center py-8 text-muted-foreground">
                Inactive users view - would show only inactive users
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value) =>
                      setSelectedUser({ ...selectedUser, role: value as "admin" | "warehouse" | "pharmacy" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="warehouse">Warehouse Manager</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={selectedUser.phone || ""}
                    onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedUser.status}
                  onValueChange={(value) =>
                    setSelectedUser({ ...selectedUser, status: value as "active" | "inactive" | "pending" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for{" "}
              <strong>{selectedUser?.name}</strong> and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
