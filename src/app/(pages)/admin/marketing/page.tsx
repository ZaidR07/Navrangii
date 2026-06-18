"use client"

import Link from "next/link"
import { MessageSquare, Send, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MarketingPage() {
  return (
    <div className="min-h-[60vh]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">Choose a WhatsApp module to continue.</p>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Send className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">WhatsApp</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Run campaigns and view message delivery reports.</p>
            </div>

            <div className="flex gap-3">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/admin/marketing/whatsapp/campaign">Campaign</Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-300 text-blue-700">
                <Link href="/admin/marketing/whatsapp/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reports
                </Link>
              </Button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
