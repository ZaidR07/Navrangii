// components/form-input.tsx
import {
  Control,
  FieldValues,
  Path,
  Controller,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeHolder?: string;
  disabled?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
}

export default function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeHolder,
  disabled = false,
  maxLength,
  icon,
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={type}
                placeholder={placeHolder}
                disabled={disabled}
                maxLength={maxLength}
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value =
                    type === "number"
                      ? e.target.value === ""
                        ? ""
                        : Number(e.target.value)
                      : e.target.value;
                  field.onChange(value);
                }}
              />
              {icon && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {icon}
                </div>
              )}
            </div>
          </FormControl>
          {fieldState?.error && (
            <FormMessage className="text-red-600">{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}
