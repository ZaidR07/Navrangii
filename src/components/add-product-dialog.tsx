/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Accordion } from "@/components/ui/accordion";
import type { Product } from "@/lib/types/productType";
import {
  productSchema,
  type ProductFormValues,
} from "@/validationSchema/productSchema";
import { EMPTY_VARIANT } from "@/lib/constants/productVariantDefaultValue";
import { mapVariantToPayload } from "@/helper/stringOrUndefinedEnum";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import ProductBasics from "./form-components/product-basics";
import VariantCard from "./variant-card";
import { useGetVariable } from "@/hooks/variable/useGetVariable";
import { AxiosError } from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ProductDialog({
  initialProduct,
  trigger,
}: {
  initialProduct?: Product;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = Boolean(initialProduct);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues:
      isEdit && initialProduct
        ? {
            ...initialProduct,
            variants: initialProduct.variants?.map((v) => ({
              id: v._id,
              color: v.color,
              thumbnail: v.thumbnail ?? "",
              gallery: v.gallery ?? [],
              sizes: v.sizes ?? [],
            })) ?? [EMPTY_VARIANT],
          }
        : {
            name: "",
            description: "",
            category: "Men",
            subcategory: "T-Shirt",
            fabric: "Cotton",
            occasion: "Casual",
            patternAndPrint: "Solid",
            style: "A-Line",
            variants: [EMPTY_VARIANT],
          },
  });

  const { control, handleSubmit, reset, watch, formState } = form;
  const { errors } = formState;

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
    update: updateVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const watchedVariants = watch("variants");
  const {
    mutate:   createProduct,
    isPending: creating,
  } = useCreateProduct();

  const {
    mutate: updateProduct,
    isPending: updating,
  } = useUpdateProduct();

  const {
    data: variable,
    isLoading: isLoadingVariable,
    isError,
    error,
  } = useGetVariable();
  const errorMessage =
    error instanceof AxiosError
      ? error.response?.data.message
      : "An error occurred";

      console.log("Variable data:", variable);
      

  const categoryOptions = variable?.catergory ?? [];
  const subCategoryOptions = variable?.subCatergory ?? [];
  const fabricOptions = variable?.fabric ?? [];
  const occasionOptions = variable?.occassion ?? [];
  const patternOptions = variable?.patternAndPrint ?? [];
  const styleOptions = variable?.style ?? [];
  const colorOptions = variable?.color ?? [];
  const option = variable?.option ?? [];

  if (isLoadingVariable)
    return <div className="p-6">Loading product configuration...</div>;
  if (isError || !variable)
    return (
      <Link href={"/settings"} className="p-6 text-red-500">
        <Button className="">{errorMessage}</Button>
      </Link>
    );

 const onSubmit: SubmitHandler<ProductFormValues> = (data) => {
  const variants = data.variants.map(mapVariantToPayload);

  if (isEdit && initialProduct) {
    updateProduct(
      {
        ...initialProduct,
        ...data,
        variants,
        subcategory: data.subcategory,
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
          setServerError(null);
          toast.success("Product updated successfully!", { position: "top-right" });
        },
        onError: (error: any) => {
          setServerError(
            error?.response?.data?.message || "Failed to update product"
          );
        },
      }
    );
  } else {
    const payload: Product = {
      ...data,
      subcategory: data.subcategory,
      variants,
      description: data.description ?? "",
      options: data.option ? JSON.stringify(data.option) : undefined,
    };
    createProduct(payload, {
      onSuccess: () => {
        setOpen(false);
        reset();
        setServerError(null);
        toast.success("Product created successfully!", { position: "top-right" });
      },
      onError: (error: any) => {
        setServerError(
          error?.response?.data?.message || "Failed to create product"
        );
      },
    });
  }
};

  const onError = (errors: any) => {
    console.log(" validation errors", errors);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto scrollbar-hide border-0 shadow-xl shadow-purple-300">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Product" : "Create New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the product details and manage its variants."
              : "Fill in the product details and add one or more variants."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-8 py-4"
          >
            {Object.keys(errors).length > 0 && (
              <div className="text-red-500 bg-red-100 px-4 py-2 rounded">
                Please fix the highlighted errors below.
              </div>
            )}

            {serverError && (
              <div className="text-red-600 bg-red-100 px-4 py-2 rounded">
                {serverError}
              </div>
            )}

            <ProductBasics
              control={control}
              categoryOptions={categoryOptions}
              subCategoryOptions={subCategoryOptions}
              fabricOptions={fabricOptions}
              occasionOptions={occasionOptions}
              patternOptions={patternOptions}
              styleOptions={styleOptions}
              option={option}
            />

            <div>
              <h3 className="text-lg font-medium mb-4">Product Variants</h3>
              <Accordion
                type="multiple"
                className="w-full mb-5 space-y-4"
                defaultValue={["item-0"]}
              >
                {variantFields.map((variant, idx) => (
                  <VariantCard
                    key={variant.id}
                    index={idx}
                    variant={watchedVariants[idx]}
                    control={control}
                    remove={removeVariant}
                    update={updateVariant}
                    colorOptions={colorOptions}
                  />
                ))}
              </Accordion>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => appendVariant(EMPTY_VARIANT)}
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Variant
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                className="border-red-600 text-red-500 border"
                onClick={() => {
                  setOpen(false);
                  reset();
                  setServerError(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creating || updating}
                className={
                  creating || updating
                    ? "bg-muted text-muted-foreground"
                    : isEdit
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-purple-700 hover:bg-purple-900 text-white"
                }
              >
                {creating || updating
                  ? isEdit
                    ? "Updating…"
                    : "Saving…"
                  : isEdit
                  ? "Save Changes"
                  : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
