"use client";

import { ProductFormValues } from "@/validationSchema/productSchema";
import Image from "next/image";
import { Control } from "react-hook-form";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { FormField, FormItem, FormMessage } from "../ui/form";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function GalleryUpload({
  control,
  name,
}: {
  control: Control<ProductFormValues>;
  name: `variants.${number}.gallery`;
}) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const images: string[] = Array.isArray(field.value)
          ? field.value.filter((v): v is string => typeof v === "string")
          : [];

        const errorMessage = fieldState?.error?.message;

        return (
          <FormItem className="space-y-2">
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded-md border overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`Gallery ${i}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-1 right-1 bg-white/70 hover:bg-white"
                    onClick={() => {
                      const updated = [...images];
                      updated.splice(i, 1);
                      field.onChange(updated);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}

              {images.length < 4 && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setLoadingIndex(images.length);
                    try {
                      const base64 = await fileToBase64(file);
                      const updated = [...images, base64];
                      field.onChange(updated.slice(0, 4));
                    } catch (err) {
                      console.error("Failed to convert to base64", err);
                    } finally {
                      setLoadingIndex(null);
                    }
                  }}
                  disabled={loadingIndex !== null}
                  className={cn("w-48", fieldState?.error && "border-red-500")}
                />
              )}
            </div>
            {errorMessage ? (
              <p className="text-sm text-red-600">{errorMessage}</p>
            ) : (
              <FormMessage className="text-red-600" />
            )}
          </FormItem>
        );
      }}
    />
  );
}
