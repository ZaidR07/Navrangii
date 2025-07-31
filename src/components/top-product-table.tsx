"use client";

import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductCarouselProps } from "@/lib/types/reactComponentsProps";
import { Package, TrendingUp, DollarSign } from "lucide-react";
import { Badge } from "./ui/badge";

export function TopProductTable({ products }: ProductCarouselProps) {
  return (
      <div className="w-full bg-white dark:bg-slate-800 p-6">
        <h2 className="text-xl font-semibold mb-2 text-slate-700 dark:text-slate-200">Top Selling Products</h2>
      <div className=" border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md overflow-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
            <TableRow>
              <TableHead className="min-w-[220px] text-slate-700 dark:text-slate-200">Product</TableHead>
              <TableHead className="text-right text-slate-700 dark:text-slate-200"><Package className="inline w-4 h-4 mr-1 text-purple-500" />Total Sold</TableHead>
              <TableHead className="text-right text-slate-700 dark:text-slate-200"><TrendingUp className="inline w-4 h-4 mr-1 text-green-500" />Total Revenue</TableHead>
              <TableHead className="text-right text-slate-700 dark:text-slate-200"><DollarSign className="inline w-4 h-4 mr-1 text-yellow-500" />Unit Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product, index) => (
              <TableRow
                key={index}
                className="hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                <TableCell className="text-slate-800 dark:text-slate-100 font-medium">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg border border-slate-300 dark:border-slate-600"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <Badge variant="secondary" className="mt-1 w-fit text-xs">Featured</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-purple-700 dark:text-purple-400">
                  {product.totalSell.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </TableCell>
                <TableCell className="text-right text-green-700 dark:text-green-400">
                  {product.totalAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </TableCell>
                <TableCell className="text-right text-yellow-600 dark:text-yellow-400">
                  {product.unitPrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default TopProductTable;
