// 👇 Your imports remain the same
import Image from "next/image";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal, Trash2, Edit3, PackageSearch, Eye, PlusCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductDialog from "./add-product-dialog";
import { useState } from "react";
import { Product } from "@/lib/types/productType";
import { VariantsDialog } from "./variants-dialog";
import { useHasMounted } from "@/lib/useHasMounted";
import PageLoading from "./page-loading";
import { useDeleteProduct } from "@/hooks/product/useDeleteProduct";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export function ProductTable({
  products,
  isDebouncing,
}: {
  products: Product[];
  isDebouncing: boolean;
}) {
  const [selectedProductForVariants, setSelectedProductForVariants] =
    useState<Product | null>(null);
  const [isVariantsDialogOpen, setIsVariantsDialogOpen] = useState(false);
  const hasMounted = useHasMounted();

  const handleViewVariants = (product: Product) => {
    setSelectedProductForVariants(product);
    setIsVariantsDialogOpen(true);
  };

  const { mutate: deleteProduct } = useDeleteProduct();

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId, {
        onSuccess: (data) => {
          toast.success("Product deleted successfully!", { position: "top-right" });
          console.log(data.message);
        },
        onError: (error) => {
          const errorMessage = error instanceof AxiosError ? error.response?.data?.message : "Failed to delete product";
          toast.error(
            errorMessage,
            { position: "top-right" }
          );
        },
      });
    }
  };

  if (isDebouncing) {
    return <PageLoading />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 rounded-xl bg-white dark:bg-slate-800/50 shadow-lg border border-slate-200 dark:border-slate-700">
        <PackageSearch className="h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
          No Products Found
        </h3>
        <ProductDialog
          trigger={
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl bg-white dark:bg-slate-900 shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-purple-500 to-purple-600 border-b-0">
                <TableHead className="w-[100px] text-white font-semibold py-3 px-3">
                  Image
                </TableHead>
                <TableHead className="text-white font-semibold py-3 px-3 min-w-[250px]">
                  Product
                </TableHead>
                <TableHead className="text-white font-semibold py-3 px-3">
                  Category
                </TableHead>
                <TableHead className="text-white font-semibold py-3 px-3">
                  Subcategory
                </TableHead>
                <TableHead className="text-white font-semibold py-3 px-3">
                  Pattern And Print
                </TableHead>
                <TableHead className="text-white font-semibold py-3 px-3">
                  Fabric
                </TableHead>
                <TableHead className="text-white font-semibold py-3 px-3">
                  Style
                </TableHead>
                <TableHead className="text-white font-semibold py-3 px-3">
                  Occassion
                </TableHead>
                <TableHead className="text-white font-semibold py-3 px-3">
                  Variants
                </TableHead>
                <TableHead className="text-white font-semibold py-3 px-3">
                  Date Added
                </TableHead>
                <TableHead className="text-right text-white font-semibold py-3 px-3">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow
                  key={index}
                  className={`border-b border-slate-200 dark:border-slate-700 
                    ${index % 2 === 0 ? "bg-slate-50 dark:bg-slate-800/50" : "bg-white dark:bg-slate-900"}
                    hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-150`}
                >
                  <TableCell className="py-3 px-3">
                    <Image
                      src={
                        product.variants?.[0]?.thumbnail ||
                        "/placeholder.svg?width=64&height=64&query=product"
                      }
                      alt={product.name}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover shadow-md border border-slate-200 dark:border-slate-600"
                      crossOrigin="anonymous"
                    />
                  </TableCell>
                  <TableCell className="py-3 px-3">
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {product.name}
                    </div>
                    <div
                      className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs"
                      title={product.description}
                    >
                      {product.description}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-3">
                    <Badge
                      variant="outline"
                      className="border-indigo-300 text-indigo-700 bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:bg-indigo-900/30 text-xs"
                    >
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-3 text-sm text-slate-600 dark:text-slate-300">
                    {product.subcategory}
                  </TableCell>
                  <TableCell className="py-3 px-3 text-sm text-slate-600 dark:text-slate-300">
                    {product.patternAndPrint}
                  </TableCell>
                  <TableCell className="py-3 px-3 text-sm text-slate-600 dark:text-slate-300">
                    {product.fabric}
                  </TableCell>
                  <TableCell className="py-3 px-3 text-sm text-slate-600 dark:text-slate-300">
                    {product.style}
                  </TableCell>
                  <TableCell className="py-3 px-3 text-sm text-slate-600 dark:text-slate-300">
                    {product.occasion}
                  </TableCell>
                  <TableCell className="py-3 px-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewVariants(product)}
                      className="text-purple-600 border-purple-300 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-600 dark:hover:bg-purple-700/30"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View ({product.variants?.length || 0})
                    </Button>
                  </TableCell>
                  <TableCell className="py-3 px-3 text-sm text-slate-600 dark:text-slate-300">
                    {hasMounted
                      ? new Date(product.createdAt || "").toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Loading date..."}
                  </TableCell>
                  <TableCell className="text-right py-3 px-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-slate-800 shadow-xl rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <DropdownMenuLabel className="text-sm font-medium text-slate-800 dark:text-slate-200 px-2 py-1.5">
                          Product Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                        <ProductDialog
                          trigger={
                            <Button className="w-full sm:w-auto">
                              <Edit3 className="mr-2 h-4 w-4" />
                              <span className="hidden sm:inline text-black">Edit Product</span>
                            </Button>
                          }
                          initialProduct={product}
                        />
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product._id ||  "")}
                          className="flex items-center text-red-600 hover:!text-red-700 hover:!bg-red-50 dark:text-red-400 dark:hover:!text-red-300 dark:hover:!bg-red-700/30 rounded-md transition-colors cursor-pointer px-2 py-2 text-sm"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <VariantsDialog
        isOpen={isVariantsDialogOpen}
        onOpenChange={setIsVariantsDialogOpen}
        product={selectedProductForVariants}
      />
    </>
  );
}
