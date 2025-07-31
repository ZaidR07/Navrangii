import {
  Control,
  Controller,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
}

export default function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  disabled = false,
}: FormSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <select
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                fieldState.error ? "border-red-500" : "border-input"
              }`}
              disabled={disabled}
            >
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormControl>

          {/* ✅ Always render FormMessage */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
