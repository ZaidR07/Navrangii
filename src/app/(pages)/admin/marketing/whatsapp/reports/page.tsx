"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, BarChart3, Calendar, Search, RefreshCw, Send, CheckCircle, XCircle, Clock, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-toastify"

interface WhatsAppReport {
  _id: string
  jobId: string
  campaignName: string
  channel: string
  message: string
  mobileNumber: string
  status: "pending" | "sent" | "delivered" | "failed"
  sentTime: string
  errorMessage?: string
  createdAt: string
}

export default function WhatsAppReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<WhatsAppReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const fetchReports = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (dateFilter) params.append("date", dateFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/whatsapp/reports?${params}`)
      const result = await response.json()

      if (result.success) {
        setReports(result.reports || [])
      } else {
        toast.error(result.message || "Failed to fetch reports")
      }
    } catch (error) {
      toast.error("Failed to fetch reports")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [dateFilter, statusFilter])

  const filteredReports = reports.filter((report) =>
    report.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.mobileNumber.includes(searchTerm) ||
    report.jobId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
      case "delivered":
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200"><CheckCircle className="h-3 w-3 mr-1" /> {status}</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>
      default:
        return <Badge className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300">{status}</Badge>
    }
  }

  const stats = {
    total: reports.length,
    sent: reports.filter(r => r.status === "sent" || r.status === "delivered").length,
    pending: reports.filter(r => r.status === "pending").length,
    failed: reports.filter(r => r.status === "failed").length,
  }

  return (
   <div>
    <h1>WhatsApp Reports</h1>
   </div>
  )
}
