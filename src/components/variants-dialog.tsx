"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/lib/types/productType";

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

interface VariantsDialogProps {
  isOpen: boolean;
  onOpenChange: (o: boolean) => void;
  product: Product | null;
}

const stockClasses = (s: number) =>
  s === 0
    ? "bg-red-100 text-red-700 border-red-300 dark:bg-red-700/20 dark:text-red-300"
    : s < 10
    ? "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-700/20 dark:text-yellow-300"
    : "bg-green-100 text-green-700 border-green-300 dark:bg-green-700/20 dark:text-green-300";

/* ------------------------------------------------------------------ */
/* component                                                          */
/* ------------------------------------------------------------------ */

export function VariantsDialog({
  isOpen,
  onOpenChange,
  product,
}: VariantsDialogProps) {
  if (!product) return null;


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-6xl h-[85vh] flex flex-col p-0 bg-white dark:bg-slate-900">
        {/* ---------- header ---------- */}
        <DialogHeader className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
          <DialogTitle className="text-lg md:text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Variants – {product.name}
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
            Detailed information about each available variation
          </DialogDescription>
        </DialogHeader>

        

        {/* ---------- scrollable variant list ---------- */}
        <ScrollArea className="flex-1 p-4 md:p-6 space-y-6">
          {product.variants?.length ? (
            product.variants.map((variant, idx) => (
              <section
                key={idx}
                className="rounded-lg border border-purple-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800/60"
              >
                {/* top strip ------------------------------------------------ */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-purple-100 dark:bg-slate-800">
                  <h4 className="text-base md:text-lg font-semibold text-purple-700 dark:text-purple-400">
                    {variant.color}
                  </h4>

                  {/* image gallery ---------------------------------------- */}
                  {variant.gallery?.length ? (
                    <div className="flex sm:gap-4 overflow-x-auto sm:overflow-visible">
                      {variant.gallery.map((url, i) => (
                        <Image
                          key={i}
                          src={url}
                          alt={`${variant.color} ${i + 1}`}
                          width={64}
                          height={64}
                          className="shrink-0 rounded-md object-cover border border-slate-300 dark:border-slate-600"
                          crossOrigin="anonymous"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* size table --------------------------------------------- */}
                <div className="p-4">
                  {variant.sizes?.length ? (
                    <div className="overflow-x-auto">
                      <Table className="text-xs md:text-sm min-w-[28rem]">
                        <TableHeader>
                          <TableRow className="bg-purple-200 dark:bg-slate-700/50">
                            <Th>Size</Th>
                            <Th align="right">MRP&nbsp;(₹)</Th>
                            <Th align="right">Price&nbsp;(₹)</Th>
                            <Th align="right">Stock</Th>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {variant.sizes.map(row => (
                            <TableRow
                              key={row.size}
                              className="hover:bg-slate-50 dark:hover:bg-slate-700/40"
                            >
                              <Td>{row.size}</Td>
                              <Td align="right">
                                {row.marketPrice.toLocaleString("en-IN")}
                              </Td>
                              <Td align="right">
                                {row.sellingPrice.toLocaleString("en-IN")}
                              </Td>
                              <Td align="right">
                                <Badge
                                  variant="outline"
                                  className={`${stockClasses(row.stock)} px-2 py-0.5`}
                                >
                                  {row.stock}
                                </Badge>
                              </Td>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No sizes configured.
                    </p>
                  )}
                </div>
              </section>
            ))
          ) : (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400">
              No variants for this product.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* tiny reusable pieces                                               */
/* ------------------------------------------------------------------ */


function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <TableHead
      className={`${
        align === "right" ? "text-right" : ""
      } text-slate-700 dark:text-slate-300`}
    >
      {children}
    </TableHead>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <TableCell
      className={`${align === "right" ? "text-right" : ""} text-slate-800 dark:text-slate-200`}
    >
      {children}
    </TableCell>
  );
}
