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
  sectionOptions: string[];
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
  sectionOptions,
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
    <Card className="pt-0 gap-3">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-lg px-4 py-3">
        <CardTitle className="text-white">Product Basics</CardTitle>
        <CardDescription className="text-purple-100">
          Enter the fundamental details for your product.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Row 1 – Name + Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="name"
            label="Product Name*"
            placeHolder="e.g. Classic Cotton Tee"
          />
          <FormSelect
            control={control}
            name="section"
            label="Section"
            options={sectionOptions}
          />
        </div>

        {/* Row 2 – Fabric + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            control={control}
            name="fabric"
            label="Fabric"
            options={fabricOptions}
          />
          <FormSelect
            control={control}
            name="category"
            label="Category*"
            options={categoryOptions}
          />
        </div>

        {/* Subcategory, Occasion, Pattern, Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <FormField
            control={control}
            name="productType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Type*</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <label className="flex items-center gap-2 rounded-md border p-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field.name}
                        value="regular"
                        checked={field.value === "regular"}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <span className="text-sm">Regular</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-md border p-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field.name}
                        value="onSale"
                        checked={field.value === "onSale"}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <span className="text-sm">On Sale</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-md border p-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field.name}
                        value="bestSeller"
                        checked={field.value === "bestSeller"}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <span className="text-sm">Best Seller</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-md border p-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field.name}
                        value="newArrival"
                        checked={field.value === "newArrival"}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <span className="text-sm">New Arrival</span>
                    </label>
                  </div>
                </FormControl>
                <FormMessage className=" text-red-600" />
              </FormItem>
            )}
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
                  rows={3}
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
