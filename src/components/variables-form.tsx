"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, ChevronDown, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  variablesFormValues,
  variablesSchema,
} from "@/validationSchema/variablesSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { fieldConfig } from "@/lib/constants/variablesTabs";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useAddVariables } from "@/hooks/variable/useAddVariable";
import { useGetVariable } from "@/hooks/variable/useGetVariable";

export default function VariablesForm() {
  const { mutateAsync: addVariables, isPending } = useAddVariables();
  const { data: existingVariables } = useGetVariable();

  const form = useForm<variablesFormValues>({
    resolver: zodResolver(variablesSchema),
    defaultValues: {
      section: [],
      catergory: [],
      subCatergory: {},
      color: [],
      occassion: [],
      patternAndPrint: [],
      style: [],
      sizes: [],
      fabric: [],
      option: [],
    },
  });

  // Load existing variables from DB into form
  useEffect(() => {
    if (existingVariables) {
      form.reset({
        section: existingVariables.section || [],
        catergory: existingVariables.catergory || [],
        subCatergory: existingVariables.subCatergory || {},
        color: existingVariables.color || [],
        occassion: existingVariables.occassion || [],
        patternAndPrint: existingVariables.patternAndPrint || [],
        style: existingVariables.style || [],
        sizes: existingVariables.sizes || [],
        fabric: existingVariables.fabric || [],
        option: existingVariables.option || [],
      });
    }
  }, [existingVariables, form]);

  const [input, setInput] = useState<Record<string, string>>(() => {
    return fieldConfig.reduce((acc, { key }) => {
      acc[key] = "";
      return acc;
    }, {} as Record<string, string>);
  });

  // Subcategory management state
  const [subCategoryInput, setSubCategoryInput] = useState<Record<string, string>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const onSubmit = async (values: variablesFormValues) => {
    console.log("Submitting variables:", values);

    try {
      // Clean up subCatergory to only include existing categories
      const cleanedSubCatergory: Record<string, string[]> = {};
      for (const cat of values.catergory) {
        cleanedSubCatergory[cat] = values.subCatergory[cat] || [];
      }

      await addVariables({
        ...values,
        subCatergory: cleanedSubCatergory,
      });
      toast.success("Product variables have been saved successfully.");
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message || "Failed to save variables."
        : "Unexpected error occurred.";
      toast.error(message);
    }
  };

  const handleAddValue = (field: string) => {
    const value = input[field]?.trim();
    if (!value) return;
    const current = (form.getValues(field as keyof variablesFormValues) as string[]) || [];
    if (!current.includes(value)) {
      form.setValue(field as keyof variablesFormValues, [...current, value] as any);
      setInput((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRemoveValue = (field: string, value: string) => {
    const current = (form.getValues(field as keyof variablesFormValues) as string[]) || [];
    const updated = current.filter((v) => v !== value);
    form.setValue(field as keyof variablesFormValues, updated as any);

    // If removing a category, also remove its subcategories
    if (field === "catergory") {
      const currentSubCatergory = form.getValues("subCatergory") || {};
      const newSubCatergory = { ...currentSubCatergory };
      delete newSubCatergory[value];
      form.setValue("subCatergory", newSubCatergory);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    field: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddValue(field);
    }
  };

  // Subcategory handlers
  const handleAddSubCategory = (category: string) => {
    const value = (subCategoryInput[category] || "").trim();
    if (!value) return;
    const currentSubCatergory = form.getValues("subCatergory") || {};
    const currentSubs = currentSubCatergory[category] || [];
    if (!currentSubs.includes(value)) {
      form.setValue("subCatergory", {
        ...currentSubCatergory,
        [category]: [...currentSubs, value],
      });
      setSubCategoryInput((prev) => ({ ...prev, [category]: "" }));
    }
  };

  const handleRemoveSubCategory = (category: string, subCategory: string) => {
    const currentSubCatergory = form.getValues("subCatergory") || {};
    const currentSubs = currentSubCatergory[category] || [];
    form.setValue("subCatergory", {
      ...currentSubCatergory,
      [category]: currentSubs.filter((s) => s !== subCategory),
    });
  };

  const handleSubCategoryKeyPress = (
    e: React.KeyboardEvent,
    category: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubCategory(category);
    }
  };

  const toggleCategoryExpand = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const categories = form.watch("catergory") || [];
  const subCatergoryMap = form.watch("subCatergory") || {};

  // Get total subcategory count for badge
  const totalSubCategories = Object.values(subCatergoryMap).reduce((sum, subs) => sum + subs.length, 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue={fieldConfig[0].key} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 h-auto p-1 bg-slate-100 dark:bg-slate-800 mb-8">
            {fieldConfig.map(({ key, label, icon: Icon }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{label}</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {key === "catergory"
                    ? `${categories.length} / ${totalSubCategories}`
                    : (form.watch(key as keyof variablesFormValues) as string[])?.length || 0}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {fieldConfig.map(({ key, label, icon: Icon, description }) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    {label}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {description}
                  </p>
                </div>
              </div>

              {key === "catergory" ? (
                /* Custom Category tab with nested subcategories */
                <div className="space-y-6">
                  {/* Add Category */}
                  <div className="space-y-4">
                    <FormLabel className="text-base font-medium text-slate-700 dark:text-slate-300">
                      Add New Category
                    </FormLabel>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input
                          value={input.catergory || ""}
                          onChange={(e) => setInput((prev) => ({ ...prev, catergory: e.target.value }))}
                          onKeyPress={(e) => handleKeyPress(e, "catergory")}
                          placeholder="Enter category name..."
                          className="h-12 text-base border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleAddValue("catergory")}
                        className="h-12 px-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-md"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add
                      </Button>
                    </div>
                  </div>

                  {/* Category list with nested subcategories */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-700 dark:text-slate-300">
                      Categories ({categories.length})
                    </h4>
                    <div className="min-h-[120px] p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      {categories.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                          <div className="text-center">
                            <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No categories added yet</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {categories.map((cat) => {
                            const subs = subCatergoryMap[cat] || [];
                            const isExpanded = expandedCategories[cat] !== false; // expanded by default

                            return (
                              <div key={cat} className="border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden">
                                {/* Category header */}
                                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => toggleCategoryExpand(cat)}
                                      className="p-1 hover:bg-purple-100 dark:hover:bg-purple-800/40 rounded"
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                      )}
                                    </button>
                                    <Badge
                                      variant="secondary"
                                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 dark:from-purple-900/50 dark:to-violet-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-700"
                                    >
                                      {cat}
                                      <X
                                        size={14}
                                        className="cursor-pointer hover:text-red-500 transition-colors duration-200"
                                        onClick={() => handleRemoveValue("catergory", cat)}
                                      />
                                    </Badge>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {subs.length} sub{subs.length !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                </div>

                                {/* Subcategories (expandable) */}
                                {isExpanded && (
                                  <div className="p-3 space-y-3 bg-white dark:bg-slate-800/30">
                                    {/* Add subcategory input */}
                                    <div className="flex gap-2">
                                      <div className="flex-1">
                                        <Input
                                          value={subCategoryInput[cat] || ""}
                                          onChange={(e) =>
                                            setSubCategoryInput((prev) => ({ ...prev, [cat]: e.target.value }))
                                          }
                                          onKeyPress={(e) => handleSubCategoryKeyPress(e, cat)}
                                          placeholder={`Add subcategory under "${cat}"...`}
                                          className="h-10 text-sm border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400"
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        onClick={() => handleAddSubCategory(cat)}
                                        size="sm"
                                        className="h-10 px-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-sm"
                                      >
                                        <Plus className="h-3 w-3 mr-1" /> Add Sub
                                      </Button>
                                    </div>

                                    {/* Subcategory list */}
                                    {subs.length === 0 ? (
                                      <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-2">
                                        No subcategories yet
                                      </p>
                                    ) : (
                                      <div className="flex flex-wrap gap-2">
                                        {subs.map((sub) => (
                                          <Badge
                                            key={sub}
                                            variant="secondary"
                                            className="flex items-center gap-2 px-2.5 py-1.5 text-xs bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 dark:from-violet-900/30 dark:to-purple-900/30 dark:text-violet-300 border border-violet-200 dark:border-violet-700 hover:shadow-sm transition-all duration-200"
                                          >
                                            {sub}
                                            <X
                                              size={12}
                                              className="cursor-pointer hover:text-red-500 transition-colors duration-200"
                                              onClick={() => handleRemoveSubCategory(cat, sub)}
                                            />
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Generic tab rendering for all other fields */
                <FormField
                  control={form.control}
                  name={key as keyof variablesFormValues}
                  render={() => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium text-slate-700 dark:text-slate-300">
                        Add New {label}
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Input
                              value={input[key] || ""}
                              onChange={(e) =>
                                setInput((prev) => ({ ...prev, [key]: e.target.value }))
                              }
                              onKeyPress={(e) => handleKeyPress(e, key)}
                              placeholder={`Enter ${label.toLowerCase()}...`}
                              className="h-12 text-base border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => handleAddValue(key)}
                            className="h-12 px-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-md"
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />

                      <div className="space-y-3">
                        <h4 className="font-medium text-slate-700 dark:text-slate-300">
                          Current {label} ({(form.watch(key as keyof variablesFormValues) as string[])?.length || 0})
                        </h4>
                        <div className="min-h-[120px] p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                          {((form.watch(key as keyof variablesFormValues) as string[]) || []).length === 0 ? (
                            <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                              <div className="text-center">
                                <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No {label.toLowerCase()} added yet</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {((form.watch(key as keyof variablesFormValues) as string[]) || []).map((value) => (
                                <Badge
                                  key={value}
                                  variant="secondary"
                                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 dark:from-purple-900/50 dark:to-violet-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-700 hover:shadow-md transition-all duration-200"
                                >
                                  {value}
                                  <X
                                    size={14}
                                    className="cursor-pointer hover:text-red-500 transition-colors duration-200"
                                    onClick={() => handleRemoveValue(key, value)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 px-8 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save All Variables
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}