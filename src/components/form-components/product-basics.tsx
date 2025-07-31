"use client";
import { useWatch, type Control } from "react-hook-form";
import type { ProductFormValues } from "@/validationSchema/productSchema";

import FormInput from "./form-input";
import FormSelect from "./form-select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type ProductBasicsProps = {
  control: Control<ProductFormValues>;
  categoryOptions: string[];
  subCategoryOptions: string[];
  fabricOptions: string[];
  occasionOptions: string[];
  patternOptions: string[];
  styleOptions: string[];
  option:string[];
};

export default function ProductBasics({
  control,
  categoryOptions,
  subCategoryOptions,
  fabricOptions,
  occasionOptions,
  patternOptions,
  styleOptions,
  option
}: ProductBasicsProps) {
  const category = useWatch({ control, name: "category" });

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-lg px-6 py-4">
        <CardTitle className="text-white">Product Basics</CardTitle>
        <CardDescription className="text-purple-100">
          Enter the fundamental details for your product.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Row 1 – Name + Fabric */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            control={control}
            name="name"
            label="Product Name*"
            placeHolder="e.g. Classic Cotton Tee"
          />
          <FormSelect
            control={control}
            name="fabric"
            label="Fabric"
            options={fabricOptions}
          />
        </div>

        {/* Category Dropdown */}
        <FormSelect
          control={control}
          name="category"
          label="Category*"
          options={categoryOptions}
        />

        {/* Subcategory, Occasion, Pattern, Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            control={control}
            name="subcategory"
            label="Subcategory*"
            options={subCategoryOptions}
            disabled={!category}
            placeholder={category ? "Select…" : "Choose category first"}
          />

          <FormSelect
            control={control}
            name="occasion"
            label="Occasion"
            options={occasionOptions}
          />
          <FormSelect
            control={control}
            name="patternAndPrint"
            label="Pattern & Print"
            options={patternOptions}
          />
          <FormSelect
            control={control}
            name="option"
            label="Option"
            options={option}
          />
          <FormSelect
            control={control}
            name="style"
            label="Style"
            options={styleOptions}
            disabled={!styleOptions.length}
          />
        </div>

        {/* Description */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Describe the product, its features, and what makes it special..."
                  {...field}
                />
              </FormControl>
              <FormMessage className=" text-red-600" />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
