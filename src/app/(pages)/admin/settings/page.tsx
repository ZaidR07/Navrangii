"use client"

import TabsSettings from "@/components/tabs-settings"
import type React from "react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/30 dark:from-slate-950 dark:via-purple-950/30 dark:to-violet-950/30">
      <div className=" px-4 py-8">
        <TabsSettings/> 
      </div>
    </div>
  )
}
