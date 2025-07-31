"use client";

import { ProductFormValues } from "@/validationSchema/productSchema";
import Image from "next/image";
import { Control, Controller, Path } from "react-hook-form";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { FormMessage } from "../ui/form";
import { useState } from "react";

export function GalleryUpload({
  control,
  name,
}: {
  control: Control<ProductFormValues>;
  name: Path<ProductFormValues>;
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
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const images: string[] = Array.isArray(field.value)
          ? field.value.filter((v): v is string => typeof v === "string")
          : [];

        return (
          <div className="space-y-2">
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
                  className="w-48"
                />
              )}
            </div>
            <FormMessage className="text-red-600" />
          </div>
        );
      }}
    />
  );
}
