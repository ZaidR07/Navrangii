"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Edit,
  Trash2,
  Search,
  Plus,
  Calendar,
  Percent,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Coupon } from "@/lib/types/couponType"
import KPICard from "@/components/kpl-card"
import { toast } from "react-toastify"
import { useGetCoupons } from "@/hooks/coupon/useGetCoupons"
import { useDeleteCoupon } from "@/hooks/coupon/useDeleteCoupon"
import PageLoading from "@/components/page-loading"

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-gradient-to-r from-green-400 to-green-500 text-white border-0"
    case "inactive":
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0"
    case "expired":
      return "bg-gradient-to-r from-red-400 to-red-500 text-white border-0"
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-3 w-3" />
    case "inactive":
      return <XCircle className="h-3 w-3" />
    case "expired":
      return <Clock className="h-3 w-3" />
    default:
      return <XCircle className="h-3 w-3" />
  }
}

export default function CouponsPage() {
  const { data: coupons, isLoading, isError } = useGetCoupons()
  const { mutateAsync: deleteCoupon } = useDeleteCoupon()
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const router = useRouter()

  // Filter coupons based on search term and status
  const filteredCoupons =
    coupons?.filter((coupon) => {
      const matchesSearch =
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || coupon.status === statusFilter
      return matchesSearch && matchesStatus
    }) || []

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      await deleteCoupon(couponId)
      toast.success("Coupon deleted successfully!")
      setCouponToDelete(null)
    } catch (error) {
      console.error("Failed to delete coupon:", error)
      toast.error("Failed to delete coupon. Please try again.")
    }
  }

  // Calculate KPIs
  const totalCoupons = coupons?.length || 0
  const activeCoupons = coupons?.filter((c) => c.status === "active").length || 0
  const totalUsage = coupons?.reduce((sum, coupon) => sum + coupon.usedCount, 0) || 0
 
  if (isLoading) {
    return <PageLoading/>
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Coupons</h3>
            <p className="text-slate-600 mb-4">Failed to load coupon data. Please try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Coupon Management
            </h1>
            <p className="text-sm bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Create and manage discount coupons for your customers
            </p>
          </div>
          <Button
            onClick={() => router.push("/coupons/form")}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Coupon
          </Button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <KPICard
          title="Total Coupons"
          value={totalCoupons}
          icon={<Tag className="h-9 w-9 text-slate-200" />}
          subtitle={
            filteredCoupons.length !== totalCoupons
              ? `${filteredCoupons.length} matching filters`
              : "All coupons listed"
          }
          color="from-purple-500 to-purple-600"
        />
        <KPICard
          title="Active Coupons"
          value={activeCoupons}
          icon={<CheckCircle className="h-9 w-9 text-slate-200" />}
          subtitle="Currently available"
          color="from-green-500 to-emerald-600"
        />
        <KPICard
          title="Total Usage"
          value={totalUsage}
          icon={<Users className="h-9 w-9 text-slate-200" />}
          subtitle="Times coupons used"
          color="from-blue-500 to-cyan-600"
        />
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search coupons by code or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-white text-slate-800 focus-visible:ring-purple-700"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="min-w-[9rem] bg-gradient-to-r from-purple-500 to-purple-600 border-white text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Coupon Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-200/50">
                  <TableHead className="text-purple-700 font-semibold">Code</TableHead>
                  <TableHead className="text-purple-700 font-semibold">Description</TableHead>
                  <TableHead className="text-purple-700 font-semibold">Discount</TableHead>
                  <TableHead className="text-purple-700 font-semibold">Usage</TableHead>
                  <TableHead className="text-purple-700 font-semibold">Validity</TableHead>
                  <TableHead className="text-purple-700 font-semibold">Status</TableHead>
                  <TableHead className="text-purple-700 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon._id} className="border-purple-100/50 hover:bg-purple-50/30">
                    <TableCell>
                      <div className="font-mono font-semibold text-purple-900 bg-purple-100 px-2 py-1 rounded text-sm">
                        {coupon.code}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-purple-900 font-medium truncate">{coupon.description}</p>
                        <p className="text-sm text-purple-600">Min. order: ₹{coupon.minimumOrderAmount}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {coupon.discountType === "percentage" ? (
                          <Percent className="h-4 w-4 text-green-600" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="font-semibold text-purple-900">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `₹${coupon.discountValue}`}
                        </span>
                      </div>
                      {coupon.maximumDiscountAmount && (
                        <p className="text-xs text-purple-600">Max: ₹{coupon.maximumDiscountAmount}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-semibold text-purple-900">
                          {coupon.usedCount} / {coupon.usageLimit}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-purple-800">
                          <Calendar className="h-3 w-3" />
                          {new Date(coupon.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-purple-600">to {new Date(coupon.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(coupon.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(coupon.status)}
                          {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 shadow-lg rounded-lg ">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                        
                          <DropdownMenuItem onClick={() => router.push(`/coupons/form?id=${coupon._id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => setCouponToDelete(coupon)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empty State */}
          {filteredCoupons.length === 0 && coupons && coupons.length > 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No coupons found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search terms or filters</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {coupons && coupons.length === 0 && (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No coupons found</h3>
              <p className="text-slate-500 mb-4">Get started by creating your first coupon</p>
              <Button
                onClick={() => router.push("/coupons/form")}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Coupon
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!couponToDelete} onOpenChange={() => setCouponToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-800 shadow-lg rounded-lg  ">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the coupon{" "}
              <span className="font-semibold text-slate-800">&quot;{couponToDelete?.code}&quot;</span>. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => couponToDelete && handleDeleteCoupon(couponToDelete._id!)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Coupon
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
