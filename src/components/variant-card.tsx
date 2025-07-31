// components/variant-card.tsx
import type {
  VariantFormValues,
  ProductFormValues,
} from "@/validationSchema/productSchema";

import { GripVertical, Trash2 } from "lucide-react";
import {
  useFieldArray,
  type Control,
  type UseFieldArrayUpdate,
} from "react-hook-form";

import {
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SizeSection from "./form-components/size-section";
import ThumbnailUpload from "./form-components/thumbnail-upload";
import { GalleryUpload } from "./form-components/gallery-upload";
import FormSelect from "./form-components/form-select";

/**
 * Single Variant Card inside ProductDialog.
 * – Header row: drag‑handle • title • delete
 * – Body: Core details, Sizing & stock, Media
 */
export default function  VariantCard({
  index,
  variant,
  control,
  remove,
  colorOptions,
}: {
  index: number;
  variant: VariantFormValues;
  control: Control<ProductFormValues>;
  remove: (idx: number) => void;
  colorOptions:string[];
  update: UseFieldArrayUpdate<ProductFormValues, "variants">;
}) {
  /* ────────────────────────────────────────── */
  /* Size field‑array                           */
  /* ────────────────────────────────────────── */
  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: `variants.${index}.sizes`,
  });

  /* ────────────────────────────────────────── */
  /* Render                                     */
  /* ────────────────────────────────────────── */
  return (
    <AccordionItem
      value={`item-${index}`}
      className="rounded-lg border bg-slate-50 dark:bg-slate-800/40 overflow-hidden"
    >
      {/* ---------- Header row (NOT inside <button>) ---------- */}
      <div className="flex items-center gap-4 px-4 py-3 text-white bg-gradient-to-r from-purple-500 to-purple-600 dark:border-slate-700/50 justify-between">
        {/* drag handle + trigger */}
        <AccordionTrigger className="flex items-center gap-4 flex-1 hover:no-underline p-0">
          <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex-1 text-left">
            <p className="font-semibold">
              Variant {index + 1}
              {variant.color && (
                <span className="font-normal text-muted-foreground"> – {variant.color}</span>
              )}
            </p>
          </div>
        </AccordionTrigger>

        {/* delete variant button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => remove(index)}
          className="ml-2 hover:bg-destructive/10 rounded-full"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      {/* ---------- Body ---------- */}
      <AccordionContent className="p-4 space-y-6">
        <div className="grid md:grid-cols-1 gap-6">
          {/* ------ left column ------ */}
          <div className="space-y-6">
            {/* Core details */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-500 py-3 to-purple-600 text-white">
                <CardTitle className="text-base">Core Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect
                           control={control}
                           name={ `variants.${index}.color`}
                           label="Color*"
                           options={colorOptions}
                         />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ------ right column ------ */}
          <div className="space-y-6">
            {/* Size / stock */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-500 py-3 to-purple-600 text-white">
                <CardTitle className="text-base">Sizing & Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <SizeSection
                  idx={index}
                  sizeFields={sizeFields}
                  appendSize={appendSize}
                  removeSize={removeSize}
                  control={control}
                />
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-500 py-3 to-purple-600 text-white">
                <CardTitle className="text-base">Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Thumbnail Image
                  </label>
                  <ThumbnailUpload
                    control={control}
                    name={`variants.${index}.thumbnail`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image Gallery
                  </label>
                  <GalleryUpload
                    control={control}
                    name={`variants.${index}.gallery`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
