"use client";

import { useGetVariable } from "@/hooks/variable/useGetVariable";
import PageLoading from "./page-loading";
import PageError from "./page-error";
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
  Tag,
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
import { toast } from "react-toastify";
import { Variables } from "@/lib/types/variablesType";
import { useDeleteVariableOption } from "@/hooks/variable/useDeleteVariableOption";

const categoryConfig = [
  { key: "catergory", label: "Categories", icon: Package, color: "bg-blue-500" },
  { key: "subCatergory", label: "Sub Categories", icon: Tag, color: "bg-green-500" },
  { key: "color", label: "Colors", icon: Palette, color: "bg-red-500" },
  { key: "occassion", label: "Occasions", icon: Calendar, color: "bg-purple-500" },
  { key: "patternAndPrint", label: "Patterns & Prints", icon: Shirt, color: "bg-orange-500" },
  { key: "style", label: "Styles", icon: Shirt, color: "bg-pink-500" },
  { key: "sizes", label: "Sizes", icon: Ruler, color: "bg-indigo-500" },
  { key: "option", label: "Option", icon: Wrench, color: "bg-blue-500" },
];

export default function ListOfVariables() {
  const { data: variable, isLoading, isError, refetch } = useGetVariable();
  const { mutateAsync: deleteOption, isPending: isDeletingOption } = useDeleteVariableOption();

  const variableData = variable as Variables;

  const handleDeleteOption = async (field: string, value: string) => {
    try {
        console.log(field,value);
        
      await deleteOption({ field, value });
      toast.success(`Deleted "${value}" from ${field}`);
      refetch();
    } catch (error) {
        console.log(error);
        
      toast.error("Failed to delete option.");
    }
  };

  if (isLoading) return <PageLoading />;
  if (isError || !variableData) return <PageError />;

  const getTotalItems = () => categoryConfig.reduce((total, { key }) => total + (variableData[key as keyof Variables]?.length || 0), 0);
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
            const items = (variableData[key as keyof Variables] as string[]) || [];

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