"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X as XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// ──────────────────────────────────────────
// Root / Trigger / Close (unchanged)
// ──────────────────────────────────────────
export function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}
export function SheetTrigger(
  props: React.ComponentProps<typeof SheetPrimitive.Trigger>,
) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}
export function SheetClose(
  props: React.ComponentProps<typeof SheetPrimitive.Close>,
) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

// ──────────────────────────────────────────
// Portal (unchanged)
// ──────────────────────────────────────────
export function SheetPortal(
  props: React.ComponentProps<typeof SheetPrimitive.Portal>,
) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

// ──────────────────────────────────────────
// O P A Q U E   O V E R L A Y
// ──────────────────────────────────────────
export function SheetOverlay(
  { className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>,
) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // animation
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        // positioning
        "fixed inset-0 z-50 transition-all",
        // opaque gradient + blur  (💡 key change)
        "bg-gradient-to-br from-purple-dark/95 via-purple-light/95 to-yellow-50/95",
        "dark:bg-gradient-to-br dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-950/95",
        "backdrop-blur-sm",
        // text colour just in case we render a spinner etc.
        "text-gray-900 dark:text-gray-100",
        className,
      )}
      {...props}
    />
  )
}

// ──────────────────────────────────────────
// R E S P O N S I V E   C O N T E N T
// ──────────────────────────────────────────
export function SheetContent(
  {
    className,
    children,
    side = "right",
    ...props
  }: React.ComponentProps<typeof SheetPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left"
  },
) {
  // width presets reused for left & right variants
  const drawerWidths =
    "w-full sm:w-4/5 md:w-96 lg:w-[26rem]" // xs‑full → sm‑80 % → md‑384px → lg‑416px

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          // base
          "fixed z-50 flex flex-col bg-background shadow-lg transition ease-in-out",
          "data-[state=closed]:duration-300 data-[state=open]:duration-500",
          // responsive sides
          side === "right" &&
            `inset-y-0 right-0 border-l
             data-[state=open]:slide-in-from-right
             data-[state=closed]:slide-out-to-right
             ${drawerWidths}`,
          side === "left" &&
            `inset-y-0 left-0 border-r
             data-[state=open]:slide-in-from-left
             data-[state=closed]:slide-out-to-left
             ${drawerWidths}`,
          side === "top" &&
            "inset-x-0 top-0 max-h-screen border-b " +
              "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-screen border-t " +
              "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          className,
        )}
        {...props}
      >
        {children}

        {/* close button */}
        <SheetPrimitive.Close
          className="absolute top-3 right-4 rounded-xl h-10 w-10 opacity-70
                     hover:opacity-100  px-2 py-1
                     border border-white disabled:pointer-events-none bg-purple-button  text-white dark:text-black"
        >
          <XIcon className="size-5 font-bold" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

// ──────────────────────────────────────────
// Utilities (unchanged)
// ──────────────────────────────────────────
export function SheetHeader(
  { className, ...props }: React.ComponentProps<"div">,
) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}
export function SheetFooter(
  { className, ...props }: React.ComponentProps<"div">,
) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}
export function SheetTitle(
  { className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>,
) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  )
}
export function SheetDescription(
  {
    className,
    ...props
  }: React.ComponentProps<typeof SheetPrimitive.Description>,
) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}
