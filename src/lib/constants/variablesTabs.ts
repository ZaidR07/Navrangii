import { variablesFormValues } from "@/validationSchema/variablesSchema";
import { Calendar, Layers, Package, Palette, Ruler, Shirt, Wrench } from "lucide-react";

export const fieldConfig = [
  { key: "section" as keyof variablesFormValues, label: "Section", icon: Layers, description: "Product sections (e.g. Men, Women, Couple)" },
  { key: "catergory" as keyof variablesFormValues, label: "Category", icon: Package, description: "Main product categories with subcategories" },
  { key: "color" as keyof variablesFormValues, label: "Colors", icon: Palette, description: "Available color options" },
  { key: "occassion" as keyof variablesFormValues, label: "Occasions", icon: Calendar, description: "Events and occasions" },
  {
    key: "patternAndPrint" as keyof variablesFormValues,
    label: "Patterns & Prints",
    icon: Shirt,
    description: "Design patterns and prints",
  },
  { key: "style" as keyof variablesFormValues, label: "Styles", icon: Shirt, description: "Fashion styles and trends" },
  { key: "sizes" as keyof variablesFormValues, label: "Sizes", icon: Ruler, description: "Available size options" },
  { key: "fabric" as keyof variablesFormValues, label: "Fabric", icon: Ruler, description: "Available fabric options" },
   {
    key: "option", // ✅ ADD THIS
    label: "Options",
    icon: Wrench,
    description: "Custom variant options like neck, sleeve, fit, etc.",
  },
]