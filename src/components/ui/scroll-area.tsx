"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

// ──────────────────────────────────────────
// R O O T   +   V I E W P O R T
// ──────────────────────────────────────────
export function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(
        //   • ensure it never grows beyond the screen on mobile
        //   • give it more breathing room on ≥md
        "relative max-h-[calc(100vh_-_theme(spacing.16))] md:max-h-[calc(100vh_-_theme(spacing.24))]",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="
          size-full rounded-[inherit]
          transition-[color,box-shadow]
          outline-none
          focus-visible:outline-1
          focus-visible:ring-[3px] focus-visible:ring-ring/50
        "
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      {/* default vertical bar + optional horizontal when needed */}
      <ScrollBar />
      <ScrollBar orientation="horizontal" />

      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

// ──────────────────────────────────────────
// S C R O L L B A R   (responsive thickness)
// ──────────────────────────────────────────
export function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none p-px transition-colors",
        // responsive widths / heights
        orientation === "vertical"
          ? "h-full w-1.5 sm:w-2 md:w-2.5 lg:w-3 border-l border-l-transparent"
          : "h-1.5 sm:h-2 md:h-2.5 lg:h-3 flex-col border-t border-t-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="
          relative flex-1 rounded-full
          bg-border hover:bg-border/80
          transition-colors
        "
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}
