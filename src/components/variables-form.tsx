"use client";

import React, { useState } from "react";
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
import { X, Plus, Save } from "lucide-react";
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

export default function VariablesForm() {
  const { mutateAsync: addVariables, isPending } = useAddVariables();

  const form = useForm<variablesFormValues>({
    resolver: zodResolver(variablesSchema),
    defaultValues: fieldConfig.reduce((acc, { key }) => {
      acc[key as keyof variablesFormValues] = [];
      return acc;
    }, {} as variablesFormValues),
  });

  const [input, setInput] = useState<Record<keyof variablesFormValues, string>>(
    () => {
      return fieldConfig.reduce((acc, { key }) => {
        acc[key as keyof variablesFormValues] = "";
        return acc;
      }, {} as Record<keyof variablesFormValues, string>);
    }
  );

  const onSubmit = async (values: variablesFormValues) => {
    console.log("Submitting variables:", values);
    
    try {
      await addVariables(values);
      form.reset();
      toast.success("Product variables have been saved successfully.");
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message || "Failed to save variables."
        : "Unexpected error occurred.";
      toast.error(message);
    }
  };

  const handleAddValue = (field: keyof variablesFormValues) => {
    const value = input[field].trim();
    if (!value) return;
    const current = form.getValues(field) || [];
    if (!current.includes(value)) {
      form.setValue(field, [...current, value]);
      setInput((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRemoveValue = (field: keyof variablesFormValues, value: string) => {
    const updated = (form.getValues(field) || []).filter((v) => v !== value);
    form.setValue(field, updated);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    field: keyof variablesFormValues
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddValue(field);
    }
  };

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
                  {form.watch(key as keyof variablesFormValues)?.length || 0}
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
                            value={input[key as keyof variablesFormValues] }
                            onChange={(e) =>
                              setInput((prev) => ({ ...prev, [key]: e.target.value }))
                            }
                            onKeyPress={(e) => handleKeyPress(e, key as keyof variablesFormValues)}
                            placeholder={`Enter ${label.toLowerCase()}...`}
                            className="h-12 text-base border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleAddValue(key as keyof variablesFormValues)}
                          className="h-12 px-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-md"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />

                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300">
                        Current {label} ({form.watch(key as keyof variablesFormValues)?.length || 0})
                      </h4>
                      <div className="min-h-[120px] p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                        {(form.watch(key as keyof variablesFormValues) || []).length === 0 ? (
                          <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                            <div className="text-center">
                              <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No {label.toLowerCase()} added yet</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {(form.watch(key as keyof variablesFormValues) || []).map((value) => (
                              <Badge
                                key={value}
                                variant="secondary"
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 dark:from-purple-900/50 dark:to-violet-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-700 hover:shadow-md transition-all duration-200"
                              >
                                {value}
                                <X
                                  size={14}
                                  className="cursor-pointer hover:text-red-500 transition-colors duration-200"
                                  onClick={() => handleRemoveValue(key as keyof variablesFormValues, value)}
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