"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, ArrowLeft, Users, MessageSquare, Clock, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { Label } from "@/components/ui/label"

interface CampaignForm {
  campaignName: string
  mobileNumbers: string
  message: string
  mediaUrl?: string
}

export default function WhatsAppCampaignPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string>("")
  const [form, setForm] = useState<CampaignForm>({
    campaignName: "",
    mobileNumbers: "",
    message: "",
    mediaUrl: "",
  })

  const parseMobileNumbers = (input: string): string[] => {
    return input
      .split(/[\n,;]+/)
      .map(num => num.trim())
      .filter(num => num.length > 0)
      .map(num => num.replace(/\s/g, ""))
  }

  const handleSubmit = async () => {
    const numbers = parseMobileNumbers(form.mobileNumbers)
    
    if (!form.campaignName.trim()) {
      toast.error("Please enter a campaign name")
      return
    }
    if (numbers.length === 0) {
      toast.error("Please enter at least one mobile number")
      return
    }
    if (!form.message.trim()) {
      toast.error("Please enter a message")
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/whatsapp/send-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: form.campaignName,
          mobileNumbers: numbers,
          message: form.message,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Campaign started! ${result.sent} messages queued.`)
        router.push("/admin/marketing/whatsapp/reports")
      } else {
        toast.error(result.message || "Failed to send campaign")
      }
    } catch (error) {
      toast.error("Failed to send campaign. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const numbers = parseMobileNumbers(form.mobileNumbers)
  const charCount = form.message.length
  const maxChars = 5000

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/marketing")}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button> */}
          <h1 className="text-2xl font-bold text-gray-900">Campaign</h1>
          <p className="text-sm text-gray-500 mt-1">
            Send a message to multiple numbers with optional delay.
          </p>
        </div>

        {/* Campaign Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Campaign Name */}
          <div className="p-6 border-b border-gray-100">
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Campaign Name
            </Label>
            <Input
              placeholder="My Campaign"
              value={form.campaignName}
              onChange={(e) => setForm({ ...form, campaignName: e.target.value })}
              className="mt-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="p-6 border-b border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Enter Mobile Number
                  </Label>
                  <span className="text-xs text-gray-400">({numbers.length} numbers)</span>
                </div>
                <Textarea
                  placeholder="Enter numbers (one per line, or separated by comma)"
                  className="min-h-[140px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  value={form.mobileNumbers}
                  onChange={(e) => setForm({ ...form, mobileNumbers: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Supports comma, semicolon, or newline.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Enter Your Message
                  </Label>
                  <span className={`text-xs ${charCount > maxChars ? 'text-red-500' : 'text-gray-400'}`}>
                    ({charCount}/{maxChars})
                  </span>
                </div>

                <div className="relative">
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-[140px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none pr-12"
                    maxLength={maxChars}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />

                  <input
                    type="file"
                    className="hidden"
                    id="campaign-file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setSelectedFileName(file?.name ?? "");
                    }}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      const el = document.getElementById("campaign-file") as HTMLInputElement | null;
                      el?.click();
                    }}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>

                {selectedFileName ? (
                  <div className="mt-2 text-xs text-gray-400 truncate">
                    {selectedFileName}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="p-6">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mx-auto flex bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-10"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
