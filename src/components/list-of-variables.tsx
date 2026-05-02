"use client";

import { useGetVariable } from "@/hooks/variable/useGetVariable";
import { toast } from "react-toastify";
import LoaderSpinner from "./loader-spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Palette,
  Calendar,
  Shirt,
  Ruler,
  Layers,
  X,
  Wrench,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Variables } from "@/lib/types/variablesType";
import { useDeleteVariableOption } from "@/hooks/variable/useDeleteVariableOption";

const categoryConfig = [
  { key: "section", label: "Sections", icon: Layers, color: "bg-teal-500" },
  { key: "catergory", label: "Categories", icon: Package, color: "bg-blue-500" },
  { key: "color", label: "Colors", icon: Palette, color: "bg-red-500" },
  { key: "occassion", label: "Occasions", icon: Calendar, color: "bg-purple-500" },
  { key: "patternAndPrint", label: "Patterns & Prints", icon: Shirt, color: "bg-orange-500" },
  { key: "style", label: "Styles", icon: Shirt, color: "bg-pink-500" },
  { key: "sizes", label: "Sizes", icon: Ruler, color: "bg-indigo-500" },
  { key: "fabric", label: "Fabric", icon: Ruler, color: "bg-amber-500" },
  { key: "option", label: "Options", icon: Wrench, color: "bg-blue-500" },
];

export default function ListOfVariables() {
  const { data: variable, isLoading, isError, refetch } = useGetVariable();
  const { mutateAsync: deleteOption, isPending: isDeletingOption } = useDeleteVariableOption();

  const variableData = variable as Variables;

  const handleDeleteOption = async (field: string, value: string) => {
    try {
      console.log(field, value);

      await deleteOption({ field, value });
      toast.success(`Deleted "${value}" from ${field}`);
      refetch();
    } catch (error) {
      console.log(error);

      toast.error("Failed to delete option.");
    }
  };

  if (isLoading) return <LoaderSpinner message="Loading variables..." />;

  if (isError || !variableData) {
    toast.error("Failed to load variables. Please try again later.");
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-medium text-red-700 dark:text-red-300">
          Failed to load variables
        </p>
      </div>
    );
  }

  const getTotalItems = () => {
    let total = 0;
    for (const { key } of categoryConfig) {
      if (key === "catergory") {
        total += (variableData.catergory?.length || 0);
        // Also count subcategories
        const subMap = variableData.subCatergory || {};
        total += Object.values(subMap).reduce((sum, subs) => sum + subs.length, 0);
      } else {
        total += ((variableData as any)[key]?.length || 0);
      }
    }
    return total;
  };

  // Helper to get subcategory map for category display
  const subCatergoryMap = variableData.subCatergory || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/30 dark:from-slate-950 dark:via-purple-950/30 dark:to-violet-950/30">
      <div className="px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Product Variables
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Manage and view your configured product attributes</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{getTotalItems()}</div>
              <div className="text-sm text-slate-500">Total Items</div>
            </div>
          </div>
         
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryConfig.map(({ key, label, icon: Icon, color }) => {
            // Special rendering for Category card with nested subcategories
            if (key === "catergory") {
              const categories = variableData.catergory || [];
              return (
                <Card key={key} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg border-0 pt-4 md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 ${color} rounded-lg text-white shadow-md`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">{label}</div>
                        <Badge variant="outline" className="text-xs">
                          {categories.length} categories / {Object.values(subCatergoryMap).reduce((sum, subs) => sum + subs.length, 0)} subcategories
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categories.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No categories yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {categories.map((cat) => {
                          const subs = subCatergoryMap[cat] || [];
                          return (
                            <div key={cat} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Badge className="cursor-pointer gap-1 flex items-center bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                                      {cat}
                                      <X className="w-3 h-3 ml-1 text-red-500" />
                                    </Badge>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete category &quot;{cat}&quot; and all its subcategories?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteOption("catergory", cat)}
                                        disabled={isDeletingOption}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        {isDeletingOption ? "Deleting..." : "Delete"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <span className="text-xs text-slate-500">{subs.length} sub{subs.length !== 1 ? "s" : ""}</span>
                              </div>
                              {subs.length > 0 && (
                                <div className="ml-4 flex flex-wrap gap-1.5">
                                  {subs.map((sub) => (
                                    <AlertDialog key={sub}>
                                      <AlertDialogTrigger asChild>
                                        <Badge className="cursor-pointer gap-1 flex items-center bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 text-xs">
                                          {sub}
                                          <X className="w-2.5 h-2.5 ml-0.5 text-red-500" />
                                        </Badge>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete subcategory &quot;{sub}&quot; from &quot;{cat}&quot;?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteOption("subCatergory", sub)}
                                            disabled={isDeletingOption}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            {isDeletingOption ? "Deleting..." : "Delete"}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            }

            // Generic rendering for other fields
            const items = (variableData as any)[key] as string[] || [];

            return (
              <Card key={key} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg border-0 pt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 ${color} rounded-lg text-white shadow-md`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">{label}</div>
                      <Badge variant="outline" className="text-xs">{items.length} items</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No items in this category</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <AlertDialog key={item}>
                          <AlertDialogTrigger asChild>
                            <Badge className="cursor-pointer gap-1 flex items-center bg-slate-100 dark:bg-slate-700">
                              {item}
                              <X className="w-3 h-3 ml-1 text-red-500" />
                            </Badge>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {item} from {label}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteOption(key, item)}
                                disabled={isDeletingOption}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {isDeletingOption ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}