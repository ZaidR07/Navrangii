"use client";

import { type Control } from "react-hook-form";
import { ProductFormValues } from "@/validationSchema/productSchema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { FormField, FormItem, FormMessage } from "../ui/form";
import { useState } from "react";

type ThumbnailUploadProps = {
  control: Control<ProductFormValues>;
  name: `variants.${number}.thumbnail`; // Allow dynamic path
};

export default function ThumbnailUpload({ control, name }: ThumbnailUploadProps) {
  const [loading, setLoading] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const img = typeof field.value === "string" ? field.value : "";

        const handleFileToBase64 = async (file: File) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        };

        const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setLoading(true);
          try {
            const base64 = await handleFileToBase64(file);
            field.onChange(base64);
          } catch (err) {
            console.error("Failed to read file", err);
          } finally {
            setLoading(false);
          }
        };

        return (
          <FormItem className="space-y-2">
            {img ? (
              <div className="relative w-28 h-28 rounded-md border overflow-hidden">
                <Image
                  src={img}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute top-1 right-1 bg-white/70 hover:bg-white"
                  onClick={() => field.onChange("")}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={handleChange}
                disabled={loading}
                className="w-48"
              />
            )}
            <FormMessage className="text-red-600" />
          </FormItem>
        );
      }}
    />
  );
}
